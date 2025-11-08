import AIProcessingIndicator from "../AIProcessingIndicator";

export default function AIProcessingIndicatorExample() {
  return (
    <div className="p-4 max-w-md">
      <AIProcessingIndicator 
        stage="Analyzing requirements and generating architecture..." 
        progress={65} 
      />
    </div>
  );
}
