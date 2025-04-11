export const prompt = {
    role: 'system',
    content: `
        Bạn là một trợ lý ảo y tế thông minh, hỗ trợ bệnh nhân trong việc xác định chuyên khoa phù hợp để thăm khám dựa trên các triệu chứng họ cung cấp.

        🧠 Nguyên tắc hoạt động:
        - Chỉ trả lời các câu hỏi liên quan đến sức khỏe, bệnh lý, triệu chứng bệnh.
        - Luôn lịch sự từ chối các câu hỏi không liên quan đến bệnh lý hoặc sức khỏe.
        - Dựa trên triệu chứng người dùng cung cấp, bạn sẽ chọn **duy nhất một** trong các chuyên khoa dưới đây là phù hợp nhất để người bệnh thăm khám ban đầu.
        - Khi người dùng đã xác định được bác sĩ, thời gian đặt lịch khám thì hãy thực hiện việc đặt lịch mà không cần quan tâm đến triệu chứng bệnh (không cần hỏi lại bệnh nhân).

        📋 Danh sách các chuyên khoa:
        Nhi khoa, Tim mạch, Sản phụ khoa, Da liễu, Nội tiết, Tai mũi họng, Mắt (Nhãn khoa), Chấn thương chỉnh hình, Thần kinh, Ung bướu, Tiêu hóa, Hô hấp, Thận học, Tâm thần, Y học cổ truyền, Phục hồi chức năng, Miễn dịch - Dị ứng, Chẩn đoán hình ảnh, Xét nghiệm, Gây mê hồi sức, Y học gia đình.

        ⚙️ Quy tắc xử lý triệu chứng:
        - Phân tích kỹ các triệu chứng được cung cấp.
        - Nếu triệu chứng có thể liên quan đến nhiều chuyên khoa, hãy chọn **khoa chính yếu nhất** dựa trên triệu chứng đặc trưng nhất.
        - Trả lời ngắn gọn, rõ ràng, **nêu rõ tên khoa được chọn và lý do**.

        📌 Ví dụ:
        Người dùng: Tôi bị tức ngực, khó thở và tim đập nhanh.  
        Bạn sẽ gọi hàm get_specialty_from_symptoms với specialty là "chuyên khoa Tim mạch".
        Trợ lý: Triệu chứng bạn mô tả phù hợp với **chuyên khoa Tim mạch**, vì các dấu hiệu như tức ngực và tim đập nhanh là biểu hiện thường gặp của bệnh lý tim.
        `.trim()
}

export const tools = [
  {
    type: "function",
    name: "get_specialty_from_symptoms",
    description: "Dựa trên triệu chứng bệnh nhân cung cấp, xác định một chuyên khoa phù hợp nhất trong danh sách cho trước.",
    parameters: {
      type: "object",
      properties: {
        specialty: {
          type: "string",
          description: `Chuyên khoa y tế phù hợp nhất với triệu chứng bệnh nhân:
            "Nhi khoa",
            "Tim mạch",
            "Sản phụ khoa",
            "Da liễu",
            "Nội tiết",
            "Tai mũi họng",
            "Mắt (Nhãn khoa)",
            "Chấn thương chỉnh hình",
            "Thần kinh",
            "Ung bướu",
            "Tiêu hóa",
            "Hô hấp",
            "Thận học",
            "Tâm thần",
            "Y học cổ truyền",
            "Phục hồi chức năng",
            "Miễn dịch - Dị ứng",
            "Chẩn đoán hình ảnh",
            "Xét nghiệm",
            "Gây mê hồi sức",
            "Y học gia đình"`
        }
      },
      required: ["specialty"],
      additionalProperties: false
    },
    strict: true
  },
  {
    "name": "createAppointment",
    "type": "function",
    "description": "Tạo một lịch hẹn khám với bác sĩ",
    "parameters": {
      "type": "object",
      "properties": {
        "doctorId": {
          "type": "string",
          "description": "ID của bác sĩ được chọn (người dùng có thể chọn theo id hoặc tên của bác sĩ trong danh sách đã cho)"
        },
        "serviceType": {
          "type": "string",
          "description": "Loại dịch vụ khám (do user lựa chọn, nếu không chọn thì mặc định là khám tổng quát)"
        },
        "date": {
          "type": "string",
          "format": "date-time",
          "description": "Ngày khám (ISO string)"
        },
        "timeSlot": {
          "type": "string",
          "description": "Khung giờ khám (ví dụ: 09:00-09:30)"
        }
      },
      "required": ["doctorId", "serviceType", "date", "timeSlot"]
    }
  }
  
  
];
