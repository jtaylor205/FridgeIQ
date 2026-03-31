import { useState } from 'react';
 
export default function MealCard({ meal }) {
  const [expanded, setExpanded] = useState(false);
  const allInFridge = meal.missingIngredients.length === 0;
 
  const hasNutrition = meal.nutrition?.length > 0;
  const hasInstructions = meal.instructions?.length > 0;
  const hasExtra = hasNutrition || hasInstructions;
 
  return (
    <div className="meal-card">
      <div className="meal-image-wrap">
        {meal.imageUrl ? (
          <img src={meal.imageUrl} alt={meal.name} className="meal-image" />
        ) : (
          <div className="meal-placeholder">🍽️</div>
        )}
        <span
          className={`meal-status-pill${
            allInFridge ? ' meal-status-done' : ' meal-status-in-progress'
          }`}
        >
          {allInFridge ? 'Ready to make' : 'Missing items'}
        </span>
      </div>
 
      <div className="meal-body">
        <h3 className="meal-name">{meal.name}</h3>
 
        {(meal.readyInMinutes || meal.servings) && (
          <div className="meal-meta">
            {meal.readyInMinutes && (
              <span className="meal-meta-item">⏱ {meal.readyInMinutes} min</span>
            )}
            {meal.servings && (
              <span className="meal-meta-item">🍴 {meal.servings} servings</span>
            )}
          </div>
        )}
 
        <ul className="meal-ingredients">
          {meal.ingredients.map((ing) => (
            <li
              key={ing.name}
              className={`meal-ingredient${
                ing.inFridge ? ' meal-in-fridge' : ' meal-missing'
              }`}
            >
              <span className="meal-check-mark">{ing.inFridge ? '✓' : ''}</span>
              <span className="meal-ing-name">{ing.name}</span>
              <span className="meal-ing-tag">
                {ing.inFridge ? 'In fridge' : 'Need to buy'}
              </span>
            </li>
          ))}
        </ul>
 
        {hasExtra && (
          <button
            className="meal-expand-btn"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((prev) => !prev);
            }}
          >
            {expanded ? 'Hide details ▲' : 'Show nutrition & steps ▼'}
          </button>
        )}
 
        {expanded && (
          <div className="meal-details">
            {hasNutrition && (
              <div className="meal-nutrition">
                <h4 className="meal-section-title">Nutrition</h4>
                <div className="meal-nutrition-grid">
                  {meal.nutrition.map((n) => (
                    <div key={n.name} className="meal-nutrient">
                      <span className="meal-nutrient-amount">
                        {Math.round(n.amount)}{n.unit}
                      </span>
                      <span className="meal-nutrient-name">{n.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
 
            {hasInstructions && (
              <div className="meal-instructions">
                <h4 className="meal-section-title">Instructions</h4>
                <ol className="meal-steps">
                  {meal.instructions.map((s) => (
                    <li key={s.number} className="meal-step">
                      {s.step}
                    </li>
                  ))}
                </ol>
              </div>
            )}
 
            {meal.sourceUrl && (
              <a
                href={meal.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="meal-source-link"
              >
                View full recipe ↗
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
 