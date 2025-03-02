import TaskCard from './TaskCard';

function TaskColumn({ cabins }) {
  return (
    <div className='grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14'>
      {cabins.map((task) => (
        <CabinCard task={task} key={task.id} />
      ))}
    </div>
  );
}

export default TaskColumn;
