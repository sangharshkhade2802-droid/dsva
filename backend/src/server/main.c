#include "server.h"

#ifdef _WIN32
#include <winsock2.h>
#include <ws2tcpip.h>
#else
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#endif

static char* main_strdup(const char *s) {
    if (!s) return NULL;
    size_t len = strlen(s) + 1;
    char *dup = (char*)malloc(len);
    if (dup) memcpy(dup, s, len);
    return dup;
}

int start_http_server(int port) {
#ifdef _WIN32
    WSADATA wsa;
    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) {
        fprintf(stderr, "[DSVA Server] WSAStartup failed.\n");
        return 1;
    }
#endif

    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd < 0) {
        fprintf(stderr, "[DSVA Server] Socket creation failed.\n");
        return 1;
    }

    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, (const char*)&opt, sizeof(opt));

    struct sockaddr_in address;
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(port);

    if (bind(server_fd, (struct sockaddr*)&address, sizeof(address)) < 0) {
        fprintf(stderr, "[DSVA Server] Bind failed on port %d.\n", port);
#ifdef _WIN32
        closesocket(server_fd);
        WSACleanup();
#else
        close(server_fd);
#endif
        return 1;
    }

    if (listen(server_fd, 10) < 0) {
        fprintf(stderr, "[DSVA Server] Listen failed.\n");
        return 1;
    }

    printf("[DSVA C Engine] HTTP Server listening on http://127.0.0.1:%d\n", port);
    fflush(stdout);

    while (1) {
        struct sockaddr_in client_addr;
        int addr_len = sizeof(client_addr);
#ifdef _WIN32
        int client_socket = accept(server_fd, (struct sockaddr*)&client_addr, &addr_len);
#else
        int client_socket = accept(server_fd, (struct sockaddr*)&client_addr, (socklen_t*)&addr_len);
#endif
        if (client_socket < 0) continue;

        char buffer[16384] = {0};
        int bytes_read = recv(client_socket, buffer, sizeof(buffer) - 1, 0);
        if (bytes_read > 0) {
            buffer[bytes_read] = '\0';
            
            /* Parse HTTP request line */
            char method[16] = {0};
            char path[256] = {0};
            sscanf(buffer, "%15s %255s", method, path);
            
            /* Locate body */
            char *body = strstr(buffer, "\r\n\r\n");
            if (body) body += 4;
            else body = "";
            
            char *json_resp = handle_api_request(method, path, body);
            if (!json_resp) json_resp = main_strdup("{\"status\":\"error\"}");
            
            char header[512];
            snprintf(header, sizeof(header),
                "HTTP/1.1 200 OK\r\n"
                "Content-Type: application/json\r\n"
                "Access-Control-Allow-Origin: *\r\n"
                "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
                "Access-Control-Allow-Headers: Content-Type, Authorization\r\n"
                "Content-Length: %u\r\n"
                "Connection: close\r\n\r\n",
                (unsigned int)strlen(json_resp));
                
            send(client_socket, header, strlen(header), 0);
            send(client_socket, json_resp, strlen(json_resp), 0);
            
            free(json_resp);
        }
#ifdef _WIN32
        closesocket(client_socket);
#else
        close(client_socket);
#endif
    }

#ifdef _WIN32
    closesocket(server_fd);
    WSACleanup();
#else
    close(server_fd);
#endif
    return 0;
}

int main(int argc, char *argv[]) {
    srand((unsigned int)time(NULL));
    
    /* Support CLI invocation */
    if (argc >= 3 && strcmp(argv[1], "--cli") == 0) {
        const char *method = "POST";
        const char *path = argv[2];
        const char *body = (argc >= 4) ? argv[3] : "{}";
        char *json = handle_api_request(method, path, body);
        printf("%s\n", json ? json : "{}");
        if (json) free(json);
        return 0;
    }
    
    int port = 8080;
    if (argc >= 2) {
        port = atoi(argv[1]);
        if (port <= 0) port = 8080;
    }
    
    return start_http_server(port);
}
