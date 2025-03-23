/*
* explicando el algoritmo de coincidencia:
*
* El algoritmo de coincidencia se encarga de comparar dos usuarios y calcular un puntaje de compatibilidad entre ellos.
* El puntaje se calcula en base a los juegos y horarios de juego que tienen en común.
*
* Para calcular el puntaje, se toman en cuenta los siguientes factores:
* - Juegos en común: Se calcula el porcentaje de juegos que ambos usuarios tienen en común.
* - Horarios en común: Se calcula el porcentaje de horarios de juego que ambos usuarios tienen en común.
*
* Cada factor tiene un peso asignado que determina su importancia en el cálculo del puntaje total.
* Por defecto, el peso de los juegos es del 70% y el peso de los horarios es del 30%.
*
* El puntaje total se calcula sumando el puntaje de los juegos y el puntaje de los horarios, multiplicados por sus respectivos pesos.
* El puntaje total se redondea a dos decimales y se devuelve como un número decimal.
*
* Si alguno de los usuarios no tiene juegos o horarios de juego, el puntaje total es cero.
* Si alguno de los usuarios no tiene juegos o horarios de juego, el puntaje total es cero.
*
* El algoritmo de coincidencia se utiliza para calcular la compatibilidad entre dos usuarios y mostrarles los perfiles de los usuarios más compatibles.
*
* En resumen, el algoritmo de coincidencia compara los juegos y horarios de juego de dos usuarios para calcular un puntaje de compatibilidad entre ellos.

*/
function calculateTotalScore(user1, user2, weights = { games: 0.7, schedule: 0.3 }) {
  const games1 = user1.game_preferences || [];
  const games2 = user2.game_preferences || [];
  const times1 = user1.play_times || [];
  const times2 = user2.play_times || [];

  // Si alguno no tiene juegos o horarios, se penaliza directamente
  if (games1.length === 0 || games2.length === 0) return 0;
  if (times1.length === 0 || times2.length === 0) return 0;

  // Juegos en común
  // const commn : es un array que contiene los juegos que ambos usuarios tienen en común.
  const commonGames = games1.filter(game => games2.includes(game));
  // const totalUniqueGames : es un número que representa la cantidad total de juegos únicos que ambos usuarios tienen.
  const totalUniqueGames = new Set([...games1, ...games2]).size;
  // const gameScore : es un número que representa el porcentaje de juegos que ambos usuarios tienen en común.
  const gameScore = (commonGames.length / totalUniqueGames) * 100;

  // Horarios en común
  // const commonTimes : es un array que contiene los horarios de juego que ambos usuarios tienen en común.
  const commonTimes = times1.filter(time => times2.includes(time));
  // const minAvailable : es un número que representa la cantidad mínima de horarios disponibles entre ambos usuarios.
  const minAvailable = Math.min(times1.length, times2.length);
  // const scheduleScore : es un número que representa el porcentaje de horarios de juego que ambos usuarios tienen en común.
  const scheduleScore = (commonTimes.length / (minAvailable || 1)) * 100;

  // Score total ponderado
  // const totalScore : es un número que representa el puntaje total de compatibilidad entre ambos usuarios
  const totalScore = (gameScore * weights.games) + (scheduleScore * weights.schedule);
  return parseFloat(totalScore.toFixed(2));
}

module.exports = {
  calculateTotalScore
};
