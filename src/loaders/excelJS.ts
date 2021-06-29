import Excel from 'exceljs';
import * as path from 'path';
import fs from 'fs-extra';
async function getDay(cad:string):Promise<string>{
  let format = new Date();
  let today= `${
    (format.getMonth()+1).toString().padStart(2, '0')}-${
    format.getDate().toString().padStart(2, '0')}-${
    format.getFullYear().toString().padStart(4, '0')}`
  let splitname = cad.split('**')
  const fileName = splitname[0]+today+splitname[1]
  return fileName
} 

export async function productsPerUser(users: Array<any>):Promise<any> 
{
  try {
    const workbook = new Excel.Workbook();
    var sheet = workbook.addWorksheet("Usuarios");
    sheet.columns = [
      { header: "Nombres y apellidos", key: "name", width: 30 },
      { header: "Número de teléfono", key: "phone", width: 30 },
      { header: "Edad", key: "age", width: 20 },
      { header: "Correo electrónico", key: "email", width: 40 },
      { header: "Producto comprado", key: "productName", width: 45 },
      { header: "Valor", key: "productoPrice", width: 40 },
      { header: "Fecha (DD/MM/YYYY)", key: "productSaleDate", width: 40 },
      { header: "CO2", key: "co2", width: 20 },
    ];
    
    sheet.getRow(1).font = { bold: true };
    const rows:Array<any> = [];
    users.forEach((user) => {
      if(user.purchases.length>0){
        user.purchases.forEach((purchase:any) => {
          console.log(purchase)
          rows.push({
            name: user.name || "-",
            phone: user.phone || "-",
            age: user.age || "-",
            email: user.email || "-",
            productName: purchase.name || "-",
            productoPrice: purchase.price || "-",
            productSaleDate: purchase.saleDate || "-",
            co2: purchase.subCategory.co2 || "-"
          }); 
        });
      }else{
        rows.push({
          name: user.name || "",
          phone: user.phone || "",
          age: user.age || "",
          email: user.email || "",
          productName: "-",
          productoPrice: "-",
          productSaleDate: "-",
          co2: "-"
        }); 
      }
    });
    sheet.addRows(rows);
    const filename = await getDay(`Usuarios-(**).xlsx`);
    const filepath = path.join(__dirname, `../uploads/${await getDay(`Usuarios-(**).xlsx`)}`);
    await fs.ensureFile(filepath)
    await workbook.xlsx.writeFile(filepath)
    return {filepath, filename}
  } catch (error) {
    console.log(error)
    throw "Error al crear excel de usuarios"
  }
}
export function deleteFile(filepath: string)
{
  fs.remove(filepath , error => {
    if (error){
      console.log(error)
      throw "Error al eliminar excel de usuarios"
    } 
    console.log('success!')
  })
}