import jsPDF from 'jspdf'
import 'jspdf-autotable'

const columnWidth = {
  0: { cellWidth: 10 },
  1: { cellWidth: 75 - 0.1103333334 },
  2: { cellWidth: 55 - 0.1103333334 },
  3: { cellWidth: 10 },
  4: { cellWidth: 32 },
}
async function generateUsersMedicinesPdf(usersData, oldejHome) {
  const doc = new jsPDF()

  let startYPosition = 1
  const headers = ['Sr', 'Name', 'Medicines', 'Quantity', 'Notes'] // Remove 'oldejHome'

  doc.text(oldejHome, 105, 10, null, null, 'center')
  doc.autoTable({
    head: [headers], // Add 'oldejHome' heading at the top
    startY: 15,
    theme: 'grid',
    columnStyles: columnWidth,
    didDrawPage: function (data) {
      startYPosition = data.table.finalY
    },
  })

  usersData.forEach((user) => {
    const {grNumber , name, medicines = [], notes } = user // Ensure medicines array is initialized

    const formattedMedicines = medicines.map((medicine) => ['', '', medicine.medicineName, medicine.quantity.toString()])

    formattedMedicines[0][0] = grNumber
    formattedMedicines[0][1] = name
    formattedMedicines[0][4] = notes // Adjust index for 'notes'

    doc.autoTable({
      body: formattedMedicines,
      startY: startYPosition,
      theme: 'grid',
      columnStyles: columnWidth,
    })

    startYPosition = doc.autoTable.previous.finalY + 1
  })

  return doc.output('arraybuffer')
}

export default generateUsersMedicinesPdf
