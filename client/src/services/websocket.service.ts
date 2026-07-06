const WS_URL =
  import.meta.env.VITE_WS_URL || "ws://localhost:5000/ws/network";

class WebSocketService {
  private socket: WebSocket | null = null;

  connect(onMessage: (data: any) => void) {
    if (this.socket) return;

    this.socket = new WebSocket(WS_URL);

    this.socket.onopen = () => {
      console.log("✅ WebSocket Connected");
    };

    this.socket.onmessage = (event) => {
      onMessage(JSON.parse(event.data));
    };

    this.socket.onclose = () => {
      console.log("❌ WebSocket Disconnected");
      this.socket = null;
    };

    this.socket.onerror = (err) => {
      console.error("WebSocket Error", err);
    };
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }
}

export const websocketService = new WebSocketService();