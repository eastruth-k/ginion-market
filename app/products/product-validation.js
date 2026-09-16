const allowedConditions = ["최상", "상", "중", "하"];
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const maximumImageSize = 5 * 1024 * 1024;

function parsePrice(value) {
  const price = value.replaceAll(",", "");
  return /^\d+$/.test(price) ? Number(price) : Number.NaN;
}

export function validateProductForm(formData) {
  const values = {
    name: formData.get("name")?.toString() ?? "",
    category: formData.get("category")?.toString() ?? "",
    info: formData.get("info")?.toString() ?? "",
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
  const initialPrice = parsePrice(values.initialPrice);
  const minimumPrice = parsePrice(values.minimumPrice);
  const images = formData
    .getAll("images")
    .filter(
      (image) =>
        image && typeof image.arrayBuffer === "function" && image.size > 0,
    );
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
      "상품 이미지를 1개에서 5개까지 첨부해주세요.",
    );
  }

  if (images.some((image) => !allowedImageTypes.includes(image.type))) {
    return validationError(
      "상품 이미지는 JPG, PNG, WEBP, GIF 파일만 첨부할 수 있습니다.",
    );
  }

  if (images.some((image) => image.size > maximumImageSize)) {
    return validationError("상품 이미지 한 개의 크기는 5MB 이하여야 합니다.");
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
