import React from "react";
import "../../assets/user/AddressInput.css";

const AddressInput = ({ address, setAddressInput, addAddress }) => {
  return (
    <div className="address-section">
      <h4>Địa chỉ</h4>
      <input
        type="text"
        placeholder="Đường"
        value={address.street}
        onChange={(e) => setAddressInput({ ...address, street: e.target.value })}
      />
      <input
        type="text"
        placeholder="Quận/Huyện"
        value={address.district}
        onChange={(e) => setAddressInput({ ...address, district: e.target.value })}
      />
      <input
        type="text"
        placeholder="Thành phố"
        value={address.city}
        onChange={(e) => setAddressInput({ ...address, city: e.target.value })}
      />
      <input
        type="text"
        placeholder="Quốc gia"
        value={address.country}
        onChange={(e) => setAddressInput({ ...address, country: e.target.value })}
      />
      <button type="button" onClick={addAddress}>Thêm địa chỉ</button>
      <ul>
        {(address.street || address.district || address.city || address.country) ? (
          <li>
            {`${address.street || ""}, ${address.district || ""}, ${address.city || ""}, ${address.country || ""}`}
          </li>
        ) : (
          <li>Chưa có thông tin</li>
        )}
      </ul>
    </div>
  );
};

export default AddressInput;