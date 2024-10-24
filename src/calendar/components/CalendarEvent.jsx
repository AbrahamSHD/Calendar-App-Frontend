
export const CalendarEvent = ({ event }) => {

  const { title, user } = event;

  return (
    <div style={{ minHeight: '50px', padding: '5px' }}>
      <span className="d-block mb-3">
        <strong>{ title }</strong>
      </span>
      <span>{ user.name }</span>
    </div>
  )
}

