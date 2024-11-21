const XLSX = require('xlsx');
const path = require('path');

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Construct the path to the Excel file
      const filePath = path.join(process.cwd(), 'menu.xlsx'); // `process.cwd()` for root directory in Vercel
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const menuData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Send menu data as JSON response
      res.status(200).json(menuData);
    } catch (error) {
      console.error('Error reading menu file:', error);
      res.status(500).json({ error: 'Failed to fetch menu data.' });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
