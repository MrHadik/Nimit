function getName(params) {
  const d = new Date();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return params +' ~ '+ monthNames[d.getMonth()] + ' '+ d.getFullYear();
}

export default getName
