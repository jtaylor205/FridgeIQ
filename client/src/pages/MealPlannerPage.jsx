import { useEffect, useState } from 'react';
import { MOCK_MEAL_SUGGESTIONS } from '../mocks/data';
import MealCard from '../components/meals/MealCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import styles from './MealPlannerPage.module.css';


export default function MealPlannerPage() {
  const [meals, setMeals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMeals(MOCK_MEAL_SUGGESTIONS);
      setLoading(false);
    }, 300);
  }, []);

  if (loading) return <LoadingSpinner />;

  const potential = meals?.filter((m) => m.status !== 'done') ?? [];
  const completed = meals?.filter((m) => m.status === 'done') ?? [];

  return (
    <div>
      <div className="page-header">
        <h1>Meal Planner</h1>
        <p>Suggested meals based on what's in your fridge</p>
      </div>

      {!meals?.length ? (
        <div className={styles.empty}>
          <p>Add more items to your fridge to get meal suggestions.</p>
        </div>
      ) : (
        <>
          {potential.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Potential Meals</h2>
              <div className={styles.grid}>
                {potential.map((meal) => <MealCard key={meal.id} meal={meal} />)}
              </div>
            </section>
          )}

          {completed.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Completed Meals</h2>
              <div className={styles.grid}>
                {completed.map((meal) => <MealCard key={meal.id} meal={meal} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
