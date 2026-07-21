                                          SignBridge System
# Sign Bridge

Đây là sản phẩm hệ thống phiên dịch ngôn ngữ ký hiệu hỗ trợ người khiếm thính và khiếm thị. Hệ thống quản lý toàn diện các hoạt động nhận diện, dịch thuật ngôn ngữ ký hiệu thông qua mô hình AI, đồng thời cung cấp nền tảng quản trị (Admin Panel) mạnh mẽ. Hệ thống cung cấp các tính năng quản lý người dùng, quản lý từ điển ký hiệu, theo dõi lịch sử phiên dịch và quản lý các phiên bản AI Model. Hệ thống có thể hoạt động độc lập như một nền tảng hỗ trợ giao tiếp hoặc tích hợp vào các hệ thống y tế/giáo dục chuyên biệt.

Table of Contents
General structure of the project
# 1.1. Frontend: React + JavaScript
# 1.2. Backend: FastAPI + Python + MongoDB

System Operating Flow Description

Bảo mật và quản lý dữ liệu

Hướng dẫn build
# 4.1. Backend
# 4.2. Frontend

# 1. General structure of the project
Dưới đây là cấu trúc thư mục tổng thể của toàn bộ dự án:

```text
/UNG-DUNG-AI-NHAN-DIEN...        # Thư mục gốc của dự án
├── .venv/                       # Môi trường ảo Python (chứa các thư viện backend)
├── .venv-1/                     # Môi trường ảo Python dự phòng 1
├── .venv-2/                     # Môi trường ảo Python dự phòng 2
├── .vscode/                     # Các cài đặt cấu hình cho Visual Studio Code
├── backend/                     # Mã nguồn Backend (FastAPI + Python)
├── frontend/                    # Mã nguồn Frontend (ReactJS)
├── node_modules/                # Chứa các package/thư viện của Node.js
├── .gitignore                   # Cấu hình các file/thư mục không đẩy lên Git
├── package-lock.json            # Khóa phiên bản cụ thể của các thư viện npm
└── package.json                 # Cấu hình dự án npm và danh sách dependencies
```
1.1. Frontend: React + JavaScript
Nằm trong thư mục frontend/.

Quản lý giao diện người dùng và trang Admin Panel (Tổng quan, Quản lý người dùng, Quản lý từ điển).

Phân chia rõ ràng thành các components (giao diện tái sử dụng), pages (các màn hình chính), và kết nối API thông qua Axios.

# 1.2. Backend: FastAPI + Python + MongoDB (Module hóa)
Nằm trong thư mục backend/.

Hệ thống API hiệu năng cao xử lý logic, quản lý cơ sở dữ liệu bất đồng bộ.

Được module hóa chuyên sâu: Router API, tầng Services (xử lý logic CRUD) và tích hợp các mô hình AI (phân tích ảnh/video cử chỉ tay để trả về ký hiệu tương ứng). Kết nối trực tiếp với MongoDB qua thư viện Motor.

# 2. System Operating Flow Description
Client (Người dùng): Sử dụng camera hoặc tải video lên qua giao diện Frontend. Hệ thống sẽ trích xuất tọa độ/hình ảnh cử chỉ tay.

Frontend: Đóng gói dữ liệu và gửi API Request (kèm Token xác thực) lên hệ thống Backend.

Backend & AI Engine: Backend nhận dữ liệu, xử lý qua mô hình AI (nhận diện hành động). Backend sau đó đối chiếu kết quả nhận diện với Database (Bộ từ điển) để lấy ra ý nghĩa chính xác của cử chỉ.

Trả kết quả & Ghi nhận: Kết quả dịch thuật dạng văn bản được trả về cho Frontend. Đồng thời, Backend lưu lại Lịch sử phiên dịch và thống kê dữ liệu để Admin có thể theo dõi trên Dashboard.

# 3. Bảo mật và quản lý dữ liệu
JWT (JSON Web Token): Dùng để xác thực người dùng và Admin, bảo mật tuyệt đối các API thông qua dependencies của FastAPI.

Mã hóa (Hashing): Sử dụng thuật toán an toàn để mã hóa mật khẩu trước khi lưu trữ vào cơ sở dữ liệu MongoDB.

CORS (Cross-Origin Resource Sharing): Được cấu hình chặt chẽ trên FastAPI để bảo vệ API và chỉ cho phép các nguồn tin cậy truy cập.

Bảo mật cơ sở dữ liệu NoSQL: Truy xuất dữ liệu an toàn qua ObjectId, phân quyền (Role-based) chặn truy cập trái phép vào dữ liệu hệ thống.

# 4. Hướng dẫn build
# 4.1. Backend
Build môi trường
Cần cài đặt Python và kích hoạt môi trường ảo (ví dụ: .venv). Sau đó cài đặt các thư viện:

Bash
cd backend
pip install -r requirements.txt
Chạy với development server:

Bash
uvicorn app.main:app --reload
(Backend khởi chạy mặc định tại cổng 8000. Tài liệu Swagger UI tại /docs)

# 4.2. Frontend
Build môi trường
Cần cài đặt Node.js. Tại thư mục gốc hoặc thư mục frontend, chạy lệnh:

Bash
npm install
Chạy với development server:

Bash
cd frontend
npm start
Hoặc npm run dev (tùy theo cấu hình trong package.json)
