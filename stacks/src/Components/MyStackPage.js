import Album from './Record'

const MyStack = ({ myStack} ) => {
    return (
        <div>
            <h1>My Stack</h1>
            {!myStack.length? (
                <p>No albums in your stack... yet.</p>
            ): (
                myStack.map((album) => <Album key={album.id} album={album} />)
            )}
        </div>
    )
}

export default MyStack 