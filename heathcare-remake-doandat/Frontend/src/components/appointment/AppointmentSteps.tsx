
const AppointmentSteps = () => {
  return (
    <div className="animate-fade-in">
      <span className="inline-block px-4 py-1 rounded-full bg-hospital-100 text-hospital-700 font-medium text-sm mb-4">
        Đặt Lịch Khám
      </span>
      <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
        Đặt Lịch Khám Chuyên Nghiệp
      </h2>
      <p className="text-gray-600 mb-8">
        Đặt lịch khám nhanh chóng, dễ dàng và tiện lợi. Đội ngũ y bác sĩ chuyên nghiệp sẽ chăm sóc sức khỏe cho bạn và gia đình.
      </p>

      <div className="bg-white p-6 rounded-2xl shadow-soft mb-8 animate-fade-in animate-delay-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-hospital-100 text-hospital-600 flex items-center justify-center">
            <span className="font-bold">1</span>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Chọn Dịch Vụ</h3>
            <p className="text-gray-600">Chọn loại dịch vụ y tế mà bạn cần.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-soft mb-8 animate-fade-in animate-delay-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-hospital-100 text-hospital-600 flex items-center justify-center">
            <span className="font-bold">2</span>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Chọn Thời Gian</h3>
            <p className="text-gray-600">Chọn ngày và giờ phù hợp với lịch trình của bạn.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-soft animate-fade-in animate-delay-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-hospital-100 text-hospital-600 flex items-center justify-center">
            <span className="font-bold">3</span>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Xác Nhận Thông Tin</h3>
            <p className="text-gray-600">Điền thông tin cá nhân và xác nhận lịch hẹn.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSteps;
