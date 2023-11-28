//
//  MyWidget.swift
//  MyWidget
//
//  Created by HomeDesk on 2023/09/09.
//

import WidgetKit
import SwiftUI
import Intents

struct Shared:Decodable {
  let c_name: String,
      c_age: Int,
      c_email: String
  
}

struct Provider: TimelineProvider {
    // 위젯검색시 보여지는 정보
    func placeholder(in context: Context) -> SimpleEntry {
      SimpleEntry(date: Date(), name: "이름 입니다.", age: 0, email: "이메일 입니다." )
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), name: "NA", age: 0, email: "NA")
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [SimpleEntry] = []
        var name = ""
        var age = 0
        var email = ""
        let sharedDefaults = UserDefaults.init(suiteName: "group.com.app.together")
          if sharedDefaults != nil {
                do{
                  let shared = sharedDefaults?.string(forKey: "myAppData")
                  if(shared != nil){
                  let data = try JSONDecoder().decode(Shared.self, from: shared!.data(using: .utf8)!)
                      name = data.c_name
                      age = data.c_age
                      email = data.c_email
                  }
                }catch{
                  print(error)
                }
          }

        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
        let currentDate = Date()
        for hourOffset in 0 ..< 5 {
          let entryDate = Calendar.current.date(byAdding: .second, value: hourOffset, to: currentDate)!
            let entry = SimpleEntry(date: entryDate, name: name, age: age, email: email )
            entries.append(entry)
        }

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let name: String
    let age: Int
    let email: String
}


struct MyWidgetEntryView : View {
  var entry: Provider.Entry
  var redColor = Color(UIColor(displayP3Red: 1, green: 15/255, blue: 83/255, alpha: 1))
  @Environment(\.widgetFamily) var family
  
      var body: some View {
         HStack(spacing: 0) {
           VStack(alignment: .leading) {
             GeometryReader { geometry in
               VStack(alignment: .leading){
                 HStack() {
                   Image("contact")
                     .resizable()
                     .aspectRatio(contentMode: .fit)
                     .frame(width: 22, height: 22, alignment: .center )
                     .clipShape(/*@START_MENU_TOKEN@*/Circle()/*@END_MENU_TOKEN@*/)
//                     .overlay(
//                      Circle().stroke(Color.black)
//                     )
                   
                   Text("남광 할인마트")
                     .font(.system(size:20))
                     .foregroundColor(Color.white)
                     .bold()
                 }
                 
               }
               .frame(width: geometry.size.width, height: 40 )
               .background(Color(red: 57/255, green: 129/255, blue: 202/255))
             }
             // Color(red: 0.09, green: 0.63, blue: 0.52)
               VStack(alignment: .leading) {
                 
                 Text(entry.name)
                 .font(.system(size:10))
                 .bold()
                 
                 Text("\(entry.age)" + " years old")
                 .font(.system(size:10))
                 .bold()
               
                 
                 Text(entry.email)
                 .font(.system(size:10))
               
                 
                 Text(entry.date, style: .timer)
                   .bold()
                   .font(.system(size: 50))
                   .foregroundColor(Color.black)
                   .shadow(color: .gray, radius: 15, x: 7, y: 7)
                   .minimumScaleFactor(0.5)
                
               
               }
               if family == .systemMedium {
                 //미디움 사즈 기본!
                 //상단 타이틀바, 배경색(프라이머리) 아이콘 + 타이틀(흰색) + 리로드 아이콘
                 VStack(alignment: .center) {
                   Text("Last Updated")
                     .bold()
                     .font(.system(size: 12))
                     .foregroundColor(redColor)
                     .shadow(color: .gray, radius: 15, x: 7, y: 7)
                     .minimumScaleFactor(0.5)
                   Text("Today")
                     .bold()
                     .font(.system(size: 40))
                     .foregroundColor(Color.black)
                     .shadow(color: .gray, radius: 15, x: 7, y: 7)
                     .minimumScaleFactor(0.5)
                 }
               
               }

           }
           .widgetURL(URL(string: "widget-deeplink://WidgetScreen"))
             
           }

      }
}

struct MyWidget: Widget {
  let kind: String = "MyWidget"

  // StaticConfiguration은 사용자가 구성 할 수 있는 프로퍼티(ser-configurable properties)가 없는 위젯입니다.
  // IntentConfiguration은 사용자가 구성 할 수 있는 프로퍼티(user-configurable properties)가 있는 위젯입니다.
  var body: some WidgetConfiguration {
          StaticConfiguration(kind: kind, provider: Provider()) { entry in
            MyWidgetEntryView(entry: entry)
          }
          .configurationDisplayName("My Widget")
          .description("This is an example widget.")
          .supportedFamilies([.systemMedium])
      }
  
}

// 데이터가 바인딩되기전의 상태를 보여줌?
struct MyWidget_Previews: PreviewProvider {
  static var previews: some View {
      MyWidgetEntryView(entry: SimpleEntry(date: Date(), name: "", age: 0, email: ""))
              .previewContext(WidgetPreviewContext(family: .systemSmall))
      }
}
