import { useEffect, useState } from 'react';
import { MOCK_MEAL_SUGGESTIONS } from '../mocks/data';
import MealCard from '../components/meals/MealCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

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
        <p>Meal ideas based on what's in your fridge right now</p>
      </div>

      {!meals?.length ? (
        <div className="meals-empty">
          <div className="meals-empty-icon">🍽️</div>
          <div className="meals-empty-title">Nothing to suggest yet</div>
          <p className="meals-empty-text">Add more items to your fridge to get meal ideas.</p>
        </div>
      ) : (
        <>
          {potential.length > 0 && (
            <section className="meals-section">
              <div className="meals-section-header">
                <span className="meals-section-title">Potential Meals</span>
                <span className="meals-section-count">{potential.length}</span>
              </div>
              <div className="meals-grid">
                {potential.map((meal) => <MealCard key={meal.id} meal={meal} />)}
              </div>
            </section>
          )}

          {completed.length > 0 && (
            <section className="meals-section">
              <div className="meals-section-header">
                <span className="meals-section-title">Completed</span>
                <span className="meals-section-count">{completed.length}</span>
              </div>
              <div className="meals-grid">
                {completed.map((meal) => <MealCard key={meal.id} meal={meal} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
