export default function MealCard({ meal }) {
  const allInFridge = meal.missingIngredients.length === 0;

  return (
    <div className="meal-card">
      <div className="meal-image-wrap">
        {meal.imageUrl ? (
          <img src={meal.imageUrl} alt={meal.name} className="meal-image" />
        ) : (
          <div className="meal-placeholder">🍽️</div>
        )}
        <span className={`meal-status-pill${allInFridge ? ' meal-status-done' : ' meal-status-in-progress'}`}>
          {allInFridge ? 'Ready to make' : 'Missing items'}
        </span>
      </div>

      <div className="meal-body">
        <h3 className="meal-name">{meal.name}</h3>

        <ul className="meal-ingredients">
          {meal.ingredients.map((ing) => (
            <li key={ing.name} className={`meal-ingredient${ing.inFridge ? ' meal-in-fridge' : ' meal-missing'}`}>
              <span className="meal-check-mark">{ing.inFridge ? '✓' : ''}</span>
              <span className="meal-ing-name">{ing.name}</span>
              <span className="meal-ing-tag">
                {ing.inFridge ? 'In fridge' : 'Need to buy'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
