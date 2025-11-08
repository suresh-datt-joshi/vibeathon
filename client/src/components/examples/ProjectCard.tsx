import ProjectCard from "../ProjectCard";

export default function ProjectCardExample() {
  return (
    <div className="p-4 max-w-md">
      <ProjectCard
        id="1"
        name="E-commerce Platform"
        description="Full-stack e-commerce platform with cart, checkout, and payment integration"
        status="completed"
        createdAt="2 days ago"
        moduleCount={12}
        taskCount={48}
        onClick={() => console.log("View project clicked")}
      />
    </div>
  );
}
