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
  const headers = [
    [
      { content: 'Sr', styles: { cellWidth: 10, halign: 'center' } },
      { content: 'Name', styles: { cellWidth: 75 - 0.1103333334, halign: 'center' } },
      { content: 'Medicines', styles: { cellWidth: 51 - 0.1103333334 } },
      { content: 'Quantity', styles: { cellWidth: 23 } },
      { content: 'Notes', styles: { cellWidth: 23 } },
    ],
  ]

  doc.text(oldejHome, 105, 10, null, null, 'center')
  doc.autoTable({
    showHead: 'everyPage',
    head: headers,
    startY: 15,
    theme: 'striped',
    didDrawPage: function () {
      startYPosition = 24 //data.table.finalY
    },
  })

  usersData.forEach((user) => {
    const { grNumber, name, medicines = [], notes } = user // Ensure medicines array is initialized

    const formattedMedicines = medicines.map((medicine, index) =>
      index === 0
        ? ['', '', medicine.medicineName, { content: medicine.quantity.toString(), styles: { halign: 'center' } }]
        : [medicine.medicineName, { content: medicine.quantity.toString(), styles: { halign: 'center' } }],
    )

    formattedMedicines[0][0] = { content: grNumber, rowSpan: formattedMedicines.length, styles: { halign: 'center' } }
    formattedMedicines[0][1] = { content: name, rowSpan: formattedMedicines.length, styles: { halign: 'center' } }
    formattedMedicines[0][4] = {
      content: notes,
      rowSpan: formattedMedicines.length,
      styles: { halign: 'center', fontSize: 8 },
    }

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
