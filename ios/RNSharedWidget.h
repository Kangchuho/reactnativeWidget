//
//  RNSharedWidget.h
//  MoneyEx
//
//  Created by HomeDesk on 2023/09/10.
//

#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

@interface RNSharedWidget : NSObject<RCTBridgeModule>

@end
