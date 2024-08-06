export const addSeparator = (number: number): string => {
  if (number.toString().match(/\./)) {
    let [whole, decimal] = number.toString().split(".");
    whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return [whole, decimal].join(".");
  } else {
    let formatted_string = number
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // console.log(formatted_string)
    return formatted_string;
  }
};

export const removeSeparator = (text_string: string): string =>
  text_string.toString().replace(/\,/g, "");
// remove_separator("1,000,000.2343")
