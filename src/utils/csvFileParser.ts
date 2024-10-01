import Papa from 'papaparse';

export const CSVFileParser = (file: any): Promise<any> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete:  (results: any) => {
        resolve(results.data);
      }
    })
  });
}