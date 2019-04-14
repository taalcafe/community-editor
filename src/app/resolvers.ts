import gql from 'graphql-tag';

export const resolvers = {
    Mutation: {
        toggleTodo: (_, variables, {cache, getCacheKey}) => {
            const id = getCacheKey({__typename: 'TodoItem', id: variables.id});
            const fragment = gql`
                fragment completeTodo on TodoItem {
                    completed
                }
            `;
            const todo = cache.readFragment({fragment, id});
            const data = {...todo, completed: !todo.completed};
            cache.writeData({id, data});
            return null;
        }
    },
};

export const typeDefs = `

  type Mutation {
    
  }

  type Query {
    
  }
`;