let DangNhapBTN = document.getElementById('DangNhapBtn')
let DangKyBTN = document.getElementById('DangKyBtn')

DangNhapBTN.addEventListener('click', function(){
	window.location.replace("/users/logIn");
})

DangKyBTN.addEventListener('click', function(){
	window.location.replace("/users/signUp");
})