import jsPDF from 'jspdf'
import 'jspdf-autotable'
async function generateUsersMedicinesPdf(usersData, oldejHome) {
  const doc = new jsPDF()

  let startYPosition = 1
  const headers = ['sr', 'name', 'medicines', 'quonty', 'notes'] // Remove 'oldejHome'

  doc.text(oldejHome, 105, 10, null, null, 'center')
  doc.autoTable({
    head: [headers], // Add 'oldejHome' heading at the top
    startY: 15,
    theme: 'grid',
    didDrawPage: function (data) {
      startYPosition = data.table.finalY
    },
  })

  usersData.forEach((user, index) => {
    const { name, medicines = [], notes } = user // Ensure medicines array is initialized

    const formattedMedicines = medicines.map((medicine) => ['', '', medicine.medicineName, medicine.quonty.toString()])

    formattedMedicines[0][0] = (index + 1).toString()
    formattedMedicines[0][1] = name
    formattedMedicines[0][4] = notes // Adjust index for 'notes'

    doc.autoTable({
      body: formattedMedicines,
      startY: startYPosition,
      theme: 'grid',
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 81 - 0.1103333334 },
        2: { cellWidth: 61 - 0.1103333334 },
        3: { cellWidth: 10 },
        4: { cellWidth: 20 },
      },
    })

    startYPosition = doc.autoTable.previous.finalY + 1
  })

  return doc.output('arraybuffer')
}

export default generateUsersMedicinesPdf
