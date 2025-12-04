let total = 0;
function addItem(){
    let name = document.getElementById('itemName').value;
    let price = parseFloat(document.getElementById('itemPrice').value);
    if(!name || !price) return;
    let table = document.getElementById('list');
    let row = table.insertRow(-1);
    row.insertCell(0).innerHTML = name;
    row.insertCell(1).innerHTML = price;
    total += price;
    document.getElementById('total').innerText = total;
}
