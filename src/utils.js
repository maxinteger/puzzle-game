export function getById(id){
	return document.getElementById(id);
}

export function rand(min, max){
	return Math.floor(Math.random() * max) - min;
}

export function nRand(min, max) {
	var u1, u2,
		picked = -1;

	while (picked < 0 || picked > 1) {
		u1 = Math.random();
		u2 = Math.random();
		picked = 1/6 * Math.pow(-2 * Math.log(u1), 0.5) * Math.cos(2 * Math.PI * u2) + 0.5;
	}
	return Math.floor(min + picked * (max - min));
}


export function randomComparator(a,b) { return Math.random() - 0.5;}
