import * as path from 'path'

import { Injectable, NotFoundException } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'

import { ProductsService } from '../products/products.service'
import { UsersService } from '../users/users.service'
import { EntityValidationUtil } from '../utils/entity-validation.util'
import { FilePersistenceUtil } from '../utils/file-persistence.util'

import { CreateAnswerDto } from './dto/create-answer.dto'
import { CreateQuestionDto } from './dto/create-question.dto'
import { Question } from './entities/question.entity'

@Injectable()
export class QuestionsService {
  private readonly questionsFileData = path.join(process.cwd(), 'src', 'data', 'questions.json')
  private questionsData: Question[] = []

  private async loadData(): Promise<void> {
    try {
      this.questionsData = await FilePersistenceUtil.readData<Question[]>(this.questionsFileData)
    } catch (error) {
      console.error('Error loading questions data:', error)
      this.questionsData = []
    }
  }

  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {
    this.loadData().catch(error => console.error('Failed to load data:', error))
  }

  async createQuestion(data: CreateQuestionDto) {
    try {
      EntityValidationUtil.validateEntityExists(data.user, this.usersService, 'User')
      await EntityValidationUtil.validateEntityExistsAsync(
        data.product,
        this.productsService,
        'Product',
      )

      const newQuestion = {
        id: uuidv4(),
        ...data,
        answers: [],
        isAnswered: false,
        createdAt: new Date(),
      }

      this.questionsData.push(newQuestion)
      await FilePersistenceUtil.persistData(this.questionsFileData, this.questionsData)

      return {
        data: newQuestion,
        message: 'Question created successfully',
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      console.error('Error creating question:', error)
      throw new Error('Failed to create question. Please try again later.')
    }
  }

  async answerQuestion(data: CreateAnswerDto) {
    try {
      const question = this.questionsData.find(question => question.id === data.question)
      if (!question) {
        throw new NotFoundException('Question not found')
      }

      EntityValidationUtil.validateEntityExists(data.user, this.usersService, 'User')

      const newAnswer = {
        id: uuidv4(),
        question: data.question,
        user: data.user,
        content: data.content,
        createdAt: new Date(),
      }

      if (!question.answers) {
        question.answers = []
      }

      question.answers.push(newAnswer)

      question.isAnswered = true
      question.updatedAt = new Date()

      await FilePersistenceUtil.persistData(this.questionsFileData, this.questionsData)

      return {
        data: newAnswer,
        message: 'Answer created successfully',
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      console.error('Error answering question:', error)
      throw new Error('Failed to answer question. Please try again later.')
    }
  }

  findAll(limit?: number, page?: number, pagination: boolean = true) {
    let questionsResult: Question[]

    if (!pagination) {
      questionsResult = this.questionsData
      page = null
      limit = null
    } else {
      if (!page) {
        page = 1
      }
      if (!limit) {
        limit = 50
      }
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      questionsResult = this.questionsData.slice(startIndex, endIndex)
    }

    const total = questionsResult.length

    return {
      data: questionsResult,
      message: `Retrieved ${total} review`,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  findOne(id: string) {
    const questionResult = this.questionsData.find(question => question.id === id)
    if (!questionResult) {
      throw new NotFoundException('Question not found')
    }

    return {
      data: questionResult,
      message: 'Question found successfully',
    }
  }
}
