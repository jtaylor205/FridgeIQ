import { formatDate } from '../../utils/dateHelpers';
import styles from './ScanResults.module.css';

export default function ScanResults({ result, onAddToFridge }) {
  if (!result) {
    return (
      <div className={styles.empty}>
        <div className={styles.icon}>📷</div>
        <p>No results yet</p>
        <span>Upload a food image to begin scanning</span>
      </div>
    );
  }

  return (
    <div className={styles.results}>
      <div className={styles.identified}>
        <span className="badge badge-green">Verified</span>
        <h3>{result.name}</h3>
        {result.brand && <p className={styles.brand}>{result.brand}</p>}
      </div>

      {result.expirationDate && (
        <div className={styles.expiry}>
          <label>Expiration Date</label>
          <span>{formatDate(result.expirationDate)}</span>
        </div>
      )}

      {result.nutrition && (
        <div className={styles.nutrition}>
          <h4>Nutritional Information</h4>
          <div className={styles.macros}>
            {result.nutrition.calories && (
              <div className={styles.macro}>
                <span>{result.nutrition.calories}</span>
                <label>Calories</label>
              </div>
            )}
            {result.nutrition.servingSize && (
              <div className={styles.macro}>
                <span>{result.nutrition.servingSize}</span>
                <label>Serving Size</label>
              </div>
            )}
          </div>
          <table className={styles.table}>
            <tbody>
              {result.nutrition.protein != null && <tr><td>Protein</td><td>{result.nutrition.protein}g</td></tr>}
              {result.nutrition.carbs != null && <tr><td>Carbohydrates</td><td>{result.nutrition.carbs}g</td></tr>}
              {result.nutrition.fat != null && <tr><td>Fat</td><td>{result.nutrition.fat}g</td></tr>}
              {result.nutrition.sugar != null && <tr><td>Sugar</td><td>{result.nutrition.sugar}g</td></tr>}
              {result.nutrition.fiber != null && <tr><td>Fiber</td><td>{result.nutrition.fiber}g</td></tr>}
              {result.nutrition.sodium != null && <tr><td>Sodium</td><td>{result.nutrition.sodium}mg</td></tr>}
            </tbody>
          </table>
          {result.nutrition.vitamins?.length > 0 && (
            <div className={styles.vitamins}>
              <label>Vitamins & Minerals</label>
              <span>{result.nutrition.vitamins.join(' · ')}</span>
            </div>
          )}
        </div>
      )}

      <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={() => onAddToFridge(result)}>
        Add to Fridge
      </button>
    </div>
  );
}
