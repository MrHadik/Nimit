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
  const StarBgColor = '#fcfdb0'

  let startYPosition = 1
  let date = new Date()

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
        ? [
            '',
            '',
            {
              content: medicine.medicineName,
              styles: { fillColor: medicine.isStar ? StarBgColor : null },
            },
            {
              content: medicine.quantity.toString(),
              styles: { halign: 'center', fillColor: medicine.isStar ? StarBgColor : null },
            },
          ]
        : [
            {
              content: medicine.medicineName,
              styles: { fillColor: medicine.isStar ? StarBgColor : null },
            },
            {
              content: medicine.quantity.toString(),
              styles: { halign: 'center', fillColor: medicine.isStar ? StarBgColor : null },
            },
          ],
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

  let totalPages = doc.internal.getNumberOfPages() // Get total pages

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i) // Set current page

    // Add page number
    doc.setFontSize(7)
    doc.text('Page ' + i + ' of ' + totalPages, 10, doc.internal.pageSize.height - 5)
    const textWidth = doc.getStringUnitWidth(oldejHome) / doc.internal.scaleFactor
    const textX = (doc.internal.pageSize.width - textWidth) / 2
    doc.text(oldejHome, textX, doc.internal.pageSize.height - 5, null, null, 'center')
    doc.text(date + '', doc.internal.pageSize.width + 67, doc.internal.pageSize.height - 5, 90, null, 'right')
  }

  return doc.output('arraybuffer')
}

export default generateUsersMedicinesPdf
