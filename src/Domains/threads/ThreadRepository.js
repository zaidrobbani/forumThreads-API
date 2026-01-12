class ThreadRepository {
    async addThread(_newThread, _owner) {
        throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async getThreadById(_threadId) {
        throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async verifyThreadAvailability(_threadId) {
        throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async verifyThreadOwner(_threadId, _ownerId) {
        throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }
}

module.exports = ThreadRepository;