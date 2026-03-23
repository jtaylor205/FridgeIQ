import styles from './MealCard.module.css';

export default function MealCard({ meal }) {
  const allInFridge = meal.missingIngredients.length === 0;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {meal.imageUrl ? (
          <img src={meal.imageUrl} alt={meal.name} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>🍽️</div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.header}>
          <span className={`${styles.status} ${allInFridge ? styles.done : styles.inProgress}`}>
            {allInFridge ? 'Done' : 'In Progress'}
          </span>
          <h3 className={styles.name}>{meal.name}</h3>
        </div>

        <ul className={styles.ingredients}>
          {meal.ingredients.map((ing) => (
            <li key={ing.name} className={styles.ingredient}>
              <span className={ing.inFridge ? styles.checked : styles.unchecked}>
                {ing.inFridge ? '✓' : '○'}
              </span>
              <span className={styles.ingName}>{ing.name}</span>
              <span className={ing.inFridge ? styles.inFridgeLabel : styles.goToStore}>
                {ing.inFridge ? 'In Fridge' : 'Go to Store'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
