function converteParaFahrenheit() {
    const tempCelsius = parseFloat(
        document.getElementById("temperatura-celsius").value
    );

    const tempFahrenheit = tempCelsius * 1.8 + 32;
    document.getElementById("resultado-fahrenheit").value =
        tempFahrenheit.toFixed(2) + "Fahrenheit";
}
