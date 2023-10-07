const colors = ["#EA1F63", "#80CAEE", "#1D8CEA", "#10B981", "#6577F3"];

const formatWithSeparators = (input: any) => {
  try {
    if (typeof input === "number" && !isNaN(input)) {
      return input.toLocaleString("es-ES");
    } else {
      let parsedNumber = parseFloat(input);
      if (!isNaN(parsedNumber)) {
        if (parsedNumber.toString().length < input.length) return input;
        return parsedNumber.toLocaleString("es-ES");
      } else {
        return input;
      }
    }
  } catch {
    return input;
  }
};

export { colors, formatWithSeparators };
