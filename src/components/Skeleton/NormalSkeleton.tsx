const NormalSkeleton = ({ length = 20 }: { length?: number }) => {
    return (
        <div className="space-y-3">
            {Array.from(Array(length).keys()).map((_, idx) => (
                <div key={idx} className="flex gap-2 md:gap-4">
                    <div className="flex-1 h-16 rounded-md animate-pulse bg-muted" />
                    {idx % 2 === 0 && (
                        <div
                            className="rounded-md animate-pulse bg-muted"
                            style={{
                                width: `${Math.floor(Math.random() * (idx / 2)) + 5}rem`,
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

export default NormalSkeleton;