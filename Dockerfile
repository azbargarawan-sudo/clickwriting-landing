# תמונת Docker לפריסת "כתיבה בקליק" (Render / Railway / Fly.io / כל מארח)
FROM node:22-alpine

WORKDIR /app

# התקנת תלויות (שכבה נפרדת ל-cache יעיל)
COPY package*.json ./
RUN npm install --omit=dev

# העתקת שאר הקוד
COPY . .

# תיקיית מסד הנתונים
RUN mkdir -p data

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
