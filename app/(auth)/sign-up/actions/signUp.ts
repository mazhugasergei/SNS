"use server"

import User from "@/models/User"
import nodemailer from "nodemailer"
import bcrypt from "bcrypt"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

export const signUp = async (email: string, username: string, fullname: string, password: string) => {
	// if the email is in use
	await User.findOne({ email }).then((user) => {
		if (user) throw "[email]: This email is already in use."
	})

	// if the username is in use
	await User.findOne({ username }).then((user) => {
		if (user) throw "[username]: This username is already in use."
	})

	// create verification url code
	const verificationCode = await bcrypt.hash(
		Math.floor(Math.random() * 10000)
			.toString()
			.padStart(4, "0"),
		12
	)

	// create user object
	const user = {
		_id: new mongoose.Types.ObjectId().toString(),
		email,
		username,
		fullname,
		password: await bcrypt.hash(password, 12),
		verificationCode,
	}

	// create transporter
	const transporter = nodemailer.createTransport({
		service: process.env.EMAIL_SERVICE,
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_PASSWORD,
		},
	})

	// send email
	await transporter.sendMail({
		from: `${process.env.APP_NAME} <${process.env.EMAIL}>`,
		to: `Recipient <${email}>`,
		subject: `Verify your email`,
		html: `
        <body style="background: #0f172a; color: #0f172a; border-radius: .5rem; padding: 4rem 2rem;">
        <div class="container" style="background: #fff; max-width: 32rem; border-radius: .5rem; padding: 2rem; margin-left: auto; margin-right: auto;">
          <a href="${process.env.URL}">
            <img width="80" src="https://drive.google.com/uc?export=view&id=1dMBuaM1zsUxicw9rZa5MYtjbAVdQlfs3" />
          </a>
          <div style="font-size: 2rem; font-weight: 700; margin: 1rem 0 .75rem;">Verify your email</div>
          <div>Click the button below to verify your email on Wave, it helps to ensure that your account is secure. Please note that if you do not verify the email during 1 hour, your account will be deleted permanently. If you did not initiate this verification process, please ignore this email. However, if you suspect any unauthorized access to your account, please contact our <a href="mailto:${process.env.EMAIL}" style="color: #0f172a; font-weight: bold; text-decoration: underline;">support team</a> immediately.</div>
          <a href="${process.env.URL}/verification?_id=${user._id}&code=${verificationCode}" style="max-width: 10rem; display: block; text-align: center; text-decoration: none; color: #fafafa; font-weight: 500; background: #18181b; border-radius: .375rem; box-shadow: 0 .0625rem .1875rem 0 rgba(0, 0, 0, .1), 0 .0625rem .125rem -0.0625rem rgba(0, 0, 0, .1); padding: .5rem 1rem; margin: 1rem auto 0;">Verify my email</a>
        </div>
      </body>
    `,
	})

	// create not yet verified user document
	await User.create(user)

	// create token
	const token = jwt.sign({ _id: user._id, password: user.password }, process.env.JWT_SECRET || "", { expiresIn: "30d" })

	// save token
	cookies().set("token", token, { expires: new Date(Date.now() + 2592000000) })

	return { ok: true }
}
