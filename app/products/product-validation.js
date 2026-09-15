const allowedConditions = ["최상", "상", "중", "하"];

function isValidImageUrl(image) {
  try {
    const url = new URL(image);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateProductForm(formData) {
  const values = {
    name: formData.get("name")?.toString() ?? "",
    category: formData.get("category")?.toString() ?? "",
    info: formData.get("info")?.toString() ?? "",
    images: formData.get("images")?.toString() ?? "",
    region: formData.get("region")?.toString() ?? "",
    condition: formData.get("condition")?.toString() ?? "",
    initialPrice: formData.get("initialPrice")?.toString() ?? "",
    minimumPrice: formData.get("minimumPrice")?.toString() ?? "",
  };
  const name = values.name.trim();
  const category = values.category.trim();
  const info = values.info.trim();
  const region = values.region.trim();
  const condition = values.condition;
  const initialPrice = Number(values.initialPrice);
  const minimumPrice = Number(values.minimumPrice);
  const images = values.images
    .split(/\r?\n/)
    .map((image) => image.trim())
    .filter(Boolean);
  const validationError = (error) => ({ error, values });

  if (!name || !category || !info || !region) {
    return validationError(
      "상품명, 카테고리, 설명, 거래 지역을 모두 입력해주세요.",
    );
  }

  if (name.length > 100) {
    return validationError("상품명은 100자 이하로 입력해주세요.");
  }

  if (!allowedConditions.includes(condition)) {
    return validationError("상품 상태를 다시 선택해주세요.");
  }

  if (
    !Number.isInteger(initialPrice) ||
    !Number.isInteger(minimumPrice) ||
    initialPrice <= 0 ||
    minimumPrice <= 0
  ) {
    return validationError(
      "판매 시작 가격과 최저 가격은 1원 이상의 정수로 입력해주세요.",
    );
  }

  if (minimumPrice > initialPrice) {
    return validationError("판매 최저 가격은 시작 가격보다 높을 수 없습니다.");
  }

  if (images.length < 1 || images.length > 5) {
    return validationError(
      "상품 이미지 URL을 한 줄에 하나씩, 1개에서 5개까지 입력해주세요.",
    );
  }

  if (images.some((image) => !isValidImageUrl(image))) {
    return validationError(
      "이미지 주소는 http:// 또는 https://로 시작하는 URL이어야 합니다.",
    );
  }

  return {
    error: null,
    values,
    productData: {
      images,
      name,
      category,
      info,
      initialPrice,
      minimumPrice,
      region,
      condition,
    },
  };
}
