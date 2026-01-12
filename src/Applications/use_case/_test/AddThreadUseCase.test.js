const NewThread = require("../../../Domains/threads/entities/NewThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const AddThreadUseCase = require("../AddThreadUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            title: 'sebuah thread',
            body: 'sebuah body thread',
        };

        const owner = 'user-123';

        const mockAddedThread = new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            owner: owner,
        });

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedThread));

        const addedThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        })

        // Action
        const addedThread = await addedThreadUseCase.execute(useCasePayload, owner);

        // Assert
        expect(addedThread).toStrictEqual(new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            owner,
        }));
        expect(mockThreadRepository.addThread).toHaveBeenCalledWith(new NewThread({
            title: useCasePayload.title,
            body: useCasePayload.body,
        }), owner);

    })
})
