import { useEffect, useState } from 'react';
import MealCard from '../components/meals/MealCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { mealService } from '../services/mealService';
 
export default function MealPlannerPage() {
  const [meals, setMeals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 
  useEffect(() => {
    const loadMeals = async () => {
      try {
        const data = await mealService.getSuggestions();
        setMeals(data);
      } catch (err) {
        setError(err.message || 'Failed to load meal suggestions.');
      } finally {
        setLoading(false);
      }
    };
 
    loadMeals();
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
 
      {error && <p className="auth-error">{error}</p>}
 
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
                {potential.map((meal, i) => (
                  <MealCard key={`potential-${meal.id}-${i}`} meal={meal} />
                ))}
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
                {completed.map((meal, i) => (
                  <MealCard key={`completed-${meal.id}-${i}`} meal={meal} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}