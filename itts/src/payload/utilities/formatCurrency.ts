function formatCurrency(amount = 0, locale = "vi-VN", currency = "VND") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export default formatCurrency;
