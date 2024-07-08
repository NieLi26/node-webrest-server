import { Request, Response } from "express"
import { prisma } from "../../data/postgres"
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos"


export class TodosController {

    //* DI
    constructor() {}

    public getTodos = async ( req: Request, res: Response ) => {
        const todos = await prisma.todo.findMany()
        return res.json(todos)
    }

    public getTodosById = async ( req: Request, res: Response ) => {
        const { id } = req.params;
        if ( isNaN(+id) ) return res.status( 400 ).json({error: "ID argument is not a number"})
        
        const todo = await prisma.todo.findFirst({
            where: {
                id: +id
            }
        })

        return ( todo ) 
            ? res.json(todo) 
            : res.status(404).json({msg: `TODO with id ${id} not found`})
    }

    public createTodo = async (  req: Request, res: Response ) => {
        
        const [ error, createTodoDto ] = CreateTodoDto.create( req.body );

        if ( error ) return res.status( 400 ).json({ error });

        const todo = await prisma.todo.create({
            data: createTodoDto!
        });

        res.json( todo );
    }

    public updateTodo = async (  req: Request, res: Response ) => {
        const { id } = req.params;

        const [ error, updateTodoDto ] = UpdateTodoDto.create({
            ...req.body, 
            id: +id
        });
        
        if ( error ) return res.status( 400 ).json({ error });
        
        const todo = await prisma.todo.findFirst({
            where: {
                id: +id
            }
        });

        // const todo = todos.find(todo => todo.id === +id);
        if ( !todo ) return res.status( 400 ).json({error: `Todo with id ${ id } not found`})

        // if ( !text ) return res.status( 400 ).json({ error: 'Text property is required' })
        
        const updatedTodo = await prisma.todo.update({
            where: {
                id: +id
            },
            data: updateTodoDto!.values
        });

        // todo.text = text || todo.text;

        // ( completedAt === null )
        //     ? todo.completedAt = null
        //     : todo.completedAt = new Date( completedAt || todo.completedAt)
            
        res.json( updatedTodo );
    }

    public deleteTodo = async (  req: Request, res: Response ) => {
        const { id } = req.params;
        if ( isNaN(+id) ) return res.status( 400 ).json({error: "ID argument is not a number"})
    
        const todo = await prisma.todo.findFirst({
            where: {
                id: +id
            }
        })

        // const todo = todos.find(todo => todo.id === +id);
        if ( !todo ) return res.status( 400 ).json({error: `Todo with id ${ id } not found`})

        const deletedTodo = await prisma.todo.delete({
            where: {
                id: +id
            }
        })

        deletedTodo
            ? res.json( deletedTodo )
            : res.status( 400 ).json({ msg: `Todo with id ${ id } not found ` })

        // todos.splice( todos.indexOf(todo), 1 )  
        // todos.filter( todo => todo.id !== +id)
        // res.json( { todo, deletedTodo } );
    }
}