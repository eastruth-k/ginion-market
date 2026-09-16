const allowedPaymentMethods = ["card", "bank", "easy"];

export function validateCheckoutForm(formData) {
  const values = {
    buyerName: formData.get("buyerName")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    address: formData.get("address")?.toString() ?? "",
    deliveryRequest: formData.get("deliveryRequest")?.toString() ?? "",
    paymentMethod: formData.get("paymentMethod")?.toString() ?? "",
    agreement: formData.get("agreement") === "yes",
  };
  const buyerName = values.buyerName.trim();
  const phone = values.phone.trim();
  const address = values.address.trim();
  const deliveryRequest = values.deliveryRequest.trim();
  const validationError = (error) => ({ error, values });

  if (!buyerName || !phone || !address) {
    return validationError("구매자 이름, 연락처, 배송지를 모두 입력해주세요.");
  }

  if (buyerName.length > 50 || address.length > 200) {
    return validationError("구매자 이름 또는 배송지 입력값이 너무 깁니다.");
  }

  if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(phone)) {
    return validationError("연락처를 휴대전화 번호 형식으로 입력해주세요.");
  }

  if (deliveryRequest.length > 100) {
    return validationError("배송 요청사항은 100자 이하로 입력해주세요.");
  }

  if (!allowedPaymentMethods.includes(values.paymentMethod)) {
    return validationError("결제수단을 선택해주세요.");
  }

  if (!values.agreement) {
    return validationError("목업 결제 안내를 확인하고 동의해주세요.");
  }

  return {
    error: null,
    values,
    checkoutData: {
      buyerName,
      phone,
      address,
      deliveryRequest,
      paymentMethod: values.paymentMethod,
    },
  };
}
