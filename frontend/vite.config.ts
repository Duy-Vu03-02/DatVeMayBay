import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Thay đổi cổng nếu cần
    host: "0.0.0.0", // Cho phép lắng nghe từ bất kỳ địa chỉ IP nào trên máy chủ
  },
});
