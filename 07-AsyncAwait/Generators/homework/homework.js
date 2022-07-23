function* fizzBuzzGenerator(max = Infinity) {
  // Tu código acá:

  let num = 1;
  while (num <= max) {
    if (num % 3 === 0 && num % 5 === 0) yield "Fizz Buzz"
    if (num % 3 === 0) yield "Fizz"
    if (num % 5 === 0) yield "Buzz"
    else yield num
    num++;
  }
}

module.exports = fizzBuzzGenerator;
