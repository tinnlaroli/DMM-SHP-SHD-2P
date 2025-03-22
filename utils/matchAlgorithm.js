function calculateTotalScore(user1, user2, weights = { games: 0.7, schedule: 0.3 }) {
  const games1 = user1.game_preferences || [];
  const games2 = user2.game_preferences || [];
  const times1 = user1.play_times || [];
  const times2 = user2.play_times || [];

  // Si alguno no tiene juegos o horarios, se penaliza directamente
  if (games1.length === 0 || games2.length === 0) return 0;
  if (times1.length === 0 || times2.length === 0) return 0;

  // Juegos en común
  const commonGames = games1.filter(game => games2.includes(game));
  const totalUniqueGames = new Set([...games1, ...games2]).size;
  const gameScore = (commonGames.length / totalUniqueGames) * 100;

  // Horarios en común
  const commonTimes = times1.filter(time => times2.includes(time));
  const minAvailable = Math.min(times1.length, times2.length);
  const scheduleScore = (commonTimes.length / (minAvailable || 1)) * 100;

  // Score total ponderado
  const totalScore = (gameScore * weights.games) + (scheduleScore * weights.schedule);
  return parseFloat(totalScore.toFixed(2));
}

module.exports = {
  calculateTotalScore
};
