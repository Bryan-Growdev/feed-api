type CleanBase64 = {
  ext: string,
  data: string,
}


export const clearBase64 = (base64: String): CleanBase64 => {
  const [header, _, data] = base64.split(/(;base64,)/g);
  const ext = header.replaceAll(/^(.*\/)/g, '');

  return { ext, data };
}

export const validateBase64 = (base64: string): boolean =>
  Buffer.from(base64, 'base64').toString('base64') === base64;
