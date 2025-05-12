type Prediction = {
    class: string;
    confidence: number;
  };
  
  export function PredictionBarChart({ results }: { results: Prediction[] }) {
    return (
      <div className="space-y-4">
        {results.map((item, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>{item.class.replace(/_/g, " ")}</span>
              <span>{(item.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <div
                className="h-3 bg-blue-500 transition-all duration-500"
                style={{ width: `${(item.confidence * 100).toFixed(1)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
  