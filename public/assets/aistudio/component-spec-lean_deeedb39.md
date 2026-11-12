components:
  button:
    title: Button
    anatomy:
      root:
        type: container
      chevronLeft:
        type: instance
        instanceOf: chevronLeft
      text:
        type: text
      chevronRight:
        type: instance
        instanceOf: chevronRight
    props:
      type:
        type: string
        default: Secondary
        enum:
        - Secondary
        - Primary
        - Destructive
      state:
        type: string
        default: Default
        enum:
        - Default
        - Pressed
        - Disabled
      size:
        type: string
        default: lg
        enum:
        - md
        - sm
        - lg
      leftIcon:
        type: string
        examples:
        - chevronLeft
        nullable: true
      label:
        type: string
        examples:
        - Day
      rightIcon:
        type: string
        examples:
        - chevronRight
        nullable: true
    default:
      layout:
      - root:
        - chevronLeft
        - text
        - chevronRight
      elements:
        root:
          styles:
            cornerRadius: 1000
            height: 56
            mainAxisAlignment: CENTER
            crossAxisAlignment: CENTER
            layoutMode: HORIZONTAL
            layoutSizingHorizontal: HUG
            itemSpacing: 8
            padding:
              top: 8
              bottom: 8
              start: 20
              end: 20
            backgroundColor: '#27272FFF'
        chevronLeft:
          styles:
            width: 20
            height: 20
          instanceOf: chevronLeft
        text:
          styles:
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            textColor: '#E3E4E9FF'
            typography:
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 24
              letterSpacing: -0.25
          content:
            $binding: '#/props/label'
        chevronRight:
          styles:
            width: 20
            height: 20
          instanceOf: chevronRight
    variants:
    - configuration:
        size: md
      elements:
        root:
          styles:
            height: 48
            padding:
              end: 16
              start: 16
        chevronLeft:
          styles:
            width: 18
            height: 18
        chevronRight:
          styles:
            width: 18
            height: 18
    - configuration:
        size: sm
      elements:
        root:
          styles:
            height: 40
            padding:
              end: 12
              start: 12
        chevronLeft:
          styles:
            width: 16
            height: 16
        text:
          styles:
            typography:
              fontSize: 14
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 20
              letterSpacing: -0.25
              textCase: ORIGINAL
              textDecoration: NONE
        chevronRight:
          styles:
            width: 16
            height: 16
    - configuration:
        state: Pressed
      elements:
        root:
          styles:
            backgroundColor: '#0D0C11FF'
    - configuration:
        state: Disabled
      elements:
        root:
          styles:
            opacity: 0.4
    - configuration:
        type: Primary
      elements:
        root:
          styles:
            width: 123
            primaryAxisSizingMode: FIXED
            layoutSizingHorizontal: FIXED
            backgroundColor: '#4963F4FF'
    - configuration:
        type: Destructive
      elements:
        root:
          styles:
            width: 123
            primaryAxisSizingMode: FIXED
            layoutSizingHorizontal: FIXED
            backgroundColor: '#BA4949FF'
    - configuration:
        type: Primary
        size: md
      elements:
        root:
          styles:
            width: 111
    - configuration:
        type: Primary
        size: sm
      elements:
        root:
          styles:
            width: 95
    - configuration:
        type: Primary
        state: Pressed
      elements:
        root:
          styles:
            backgroundColor: '#4963F466'
    - configuration:
        type: Primary
        state: Disabled
      elements:
        root:
          styles:
            width: null
            primaryAxisSizingMode: AUTO
            layoutSizingHorizontal: HUG
    - configuration:
        type: Destructive
        size: md
      elements:
        root:
          styles:
            width: 111
    - configuration:
        type: Destructive
        size: sm
      elements:
        root:
          styles:
            width: 95
    - configuration:
        type: Destructive
        state: Pressed
      elements:
        root:
          styles:
            backgroundColor: '#BA49493D'
    - configuration:
        type: Destructive
        state: Disabled
      elements:
        root:
          styles:
            width: null
            primaryAxisSizingMode: AUTO
            layoutSizingHorizontal: HUG
  input:
    title: Input
    anatomy:
      root:
        type: container
      title:
        type: container
      label:
        type: text
      box:
        type: container
      icon:
        type: instance
        instanceOf: chevronDown
      placeholder:
        type: text
      description:
        type: text
    props:
      state:
        type: string
        default: Placeholder
        enum:
        - Placeholder
        - Filled
        - Selected
        - Disabled
      error:
        type: string
        default: false
        enum:
        - false
        - true
      showLabel:
        type: boolean
        default: true
      required:
        type: boolean
        default: true
      unit:
        type: boolean
        default: false
      description:
        type: boolean
        default: false
      label:
        type: string
        examples:
        - Date
      placeholder:
        type: string
        examples:
        - Enter Date
    default:
      layout:
      - root:
        - title:
          - label
          - label
        - box:
          - icon
          - placeholder
          - placeholder
          - icon
        - description
      elements:
        root:
          styles:
            width: 327
            layoutMode: VERTICAL
            layoutSizingVertical: HUG
            itemSpacing: 6
        title:
          styles:
            primaryAxisSizingMode: FIXED
            layoutMode: HORIZONTAL
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            itemSpacing: 2
        label:
          styles:
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            textColor: '#4963F4FF'
            typography:
              fontSize: 14
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 20
              letterSpacing: -0.25
          content: '*'
        box:
          styles:
            cornerRadius: 8
            primaryAxisSizingMode: FIXED
            crossAxisAlignment: CENTER
            layoutMode: HORIZONTAL
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            strokes: '#303037FF'
            strokeWeight: 1
            itemSpacing: 6
            padding: 12
            backgroundColor: '#27272FFF'
        icon:
          styles:
            width: 16
            height: 16
          instanceOf: chevronDown
        placeholder:
          styles:
            visible: false
            width: 22
            height: 19
            textColor: '#87878FFF'
            typography:
              fontFamily: Roboto
              fontStyle: Regular
              letterSpacing: -0.25
          content: km
        description:
          styles:
            visible: false
            width: 59
            height: 16
            textColor: '#87878FFF'
            typography:
              fontSize: 12
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 16
              letterSpacing: -0.25
          content: Description
    variants:
    - configuration:
        error: true
      elements:
        box:
          styles:
            strokes: '#BA4949FF'
        description:
          styles:
            width: 119
            textColor: '#BA4949FF'
          content: Please enter valid input
    - configuration:
        state: Selected
      elements:
        box:
          styles:
            strokes: '#4963F4FF'
            backgroundColor: '#3C3C45FF'
    - configuration:
        state: Disabled
      elements:
        box:
          styles:
            opacity: 0.6
    - configuration:
        state: Selected
        error: true
      elements:
        box:
          styles:
            strokes: '#BA4949FF'
  metric:
    title: Metric
    anatomy:
      '1020':
        type: text
      root:
        type: container
      data:
        type: container
      km:
        type: text
      distance:
        type: text
    props:
      size:
        type: string
        default: md
        enum:
        - md
        - sm
      metric:
        type: string
        examples:
        - '10.20'
      unit:
        type: string
        examples:
        - km
        nullable: true
      label:
        type: string
        examples:
        - Distance
    default:
      layout:
      - root:
        - data:
          - '1020'
          - km
        - distance
      elements:
        '1020':
          styles:
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            textColor: '#E3E4E9FF'
            typography:
              fontSize: 32
              fontFamily: Anton
              fontStyle: Regular
              lineHeight: 36
              letterSpacing: 1.6
              textCase: UPPER
          content:
            $binding: '#/props/metric'
        root:
          styles:
            layoutMode: VERTICAL
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            itemSpacing: 2
        data:
          styles:
            primaryAxisSizingMode: FIXED
            crossAxisAlignment: END
            layoutMode: HORIZONTAL
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            itemSpacing: 6
        km:
          styles:
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            textColor: '#87878FFF'
            typography:
              fontSize: 12
              fontFamily: Anton
              fontStyle: Regular
              lineHeight: 20
              letterSpacing: 0.6
          content:
            $binding: '#/props/unit'
        distance:
          styles:
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            textColor: '#87878FFF'
            typography:
              fontSize: 12
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 16
              letterSpacing: -0.25
          content:
            $binding: '#/props/label'
    variants:
    - configuration:
        size: sm
      elements:
        '1020':
          styles:
            typography:
              fontSize: 20
              fontFamily: Anton
              fontStyle: Regular
              lineHeight: 24
              letterSpacing: 1
              textCase: UPPER
              textDecoration: NONE
        distance:
          styles:
            typography:
              fontSize: 10
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 14
              letterSpacing: -0.25
              textCase: ORIGINAL
              textDecoration: NONE
  logo:
    title: Logo
    anatomy:
      root:
        type: container
      logo:
        type: vector
    default:
      layout:
      - root:
        - logo
      elements:
        root:
          styles:
            width: 194
            height: 36
        logo:
          styles:
            position: ABSOLUTE
            top: 0%
            bottom: 0%
            start: 0%
            end: 0%
  tab:
    title: Tab
    anatomy:
      root:
        type: container
      text:
        type: text
    props:
      active:
        type: string
        default: true
        enum:
        - true
        - false
      label:
        type: string
        examples:
        - Day
    default:
      layout:
      - root:
        - text
      elements:
        root:
          styles:
            cornerRadius: 1000
            width: 67
            mainAxisAlignment: CENTER
            primaryAxisSizingMode: FIXED
            crossAxisAlignment: CENTER
            layoutMode: HORIZONTAL
            layoutSizingVertical: HUG
            itemSpacing: 10
            padding:
              top: 8
              bottom: 8
              start: 12
              end: 12
            backgroundColor: '#4963F4FF'
        text:
          styles:
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            textColor: '#E3E4E9FF'
            typography:
              fontSize: 14
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 20
              letterSpacing: -0.25
          content:
            $binding: '#/props/label'
    variants:
    - configuration:
        active: false
      elements:
        root:
          styles:
            backgroundColor: null
        text:
          styles:
            textColor: '#87878FFF'
  timeGroupSelection:
    title: Time Group Selection
    anatomy:
      root:
        type: container
      tab:
        type: instance
        instanceOf: tab
    default:
      layout:
      - root:
        - tab
        - tab
        - tab
        - tab
        - tab
      elements:
        root:
          styles:
            cornerRadius: 1000
            width: 343
            primaryAxisSizingMode: FIXED
            layoutMode: HORIZONTAL
            layoutSizingVertical: HUG
            padding: 4
            backgroundColor: '#27272FFF'
        tab:
          styles:
            layoutSizingVertical: HUG
            width: 67
          propConfigurations:
            label: Yearly
            active: false
          instanceOf: tab
  miniMetricCard:
    title: Mini Metric Card
    anatomy:
      root:
        type: container
      text:
        type: text
      metric:
        type: instance
        instanceOf: metric
    props:
      cardLabel:
        type: string
        examples:
        - Highest score
    default:
      layout:
      - root:
        - text
        - metric
      elements:
        root:
          styles:
            cornerRadius: 12
            width: 133
            layoutMode: VERTICAL
            layoutSizingVertical: HUG
            itemSpacing: 8
            padding: 16
            backgroundColor: '#19191FFF'
        text:
          styles:
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            textColor: '#87878FFF'
            typography:
              fontSize: 12
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 16
              letterSpacing: -0.25
          content:
            $binding: '#/props/cardLabel'
        metric:
          styles:
            layoutSizingHorizontal: FILL
            height: 40
          propConfigurations:
            label: Distance
            showUnit: false
            unit: km
            metric: '76'
            size: sm
          instanceOf: metric
  threeMetrics:
    title: Three Metrics
    anatomy:
      root:
        type: container
      miniMetricCard:
        type: instance
        instanceOf: miniMetricCard
    default:
      layout:
      - root:
        - miniMetricCard
        - miniMetricCard
        - miniMetricCard
      elements:
        root:
          styles:
            width: 343
            primaryAxisSizingMode: FIXED
            crossAxisAlignment: CENTER
            layoutMode: HORIZONTAL
            layoutSizingVertical: HUG
            itemSpacing: 8
        miniMetricCard:
          styles:
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
          propConfigurations:
            cardLabel: Latest run
          instanceOf: miniMetricCard
  avatar:
    title: Avatar
    anatomy:
      root:
        type: container
      avatar:
        type: rectangle
    props:
      size:
        type: string
        default: sm
        enum:
        - sm
        - lg
    default:
      layout:
      - root:
        - avatar
      elements:
        root:
          styles:
            width: 40
            height: 40
            aspectRatio:
              x: 500
              y: 500
        avatar:
          styles:
            position: ABSOLUTE
            top: 0%
            bottom: 0%
            start: 0%
            end: 0%
            strokes: '#303037FF'
            strokeWeight: 1
            cornerRadius: 100
    variants:
    - configuration:
        size: lg
      elements:
        root:
          styles:
            width: 80
            height: 80
  headerHome:
    title: Header Home
    anatomy:
      root:
        type: container
      profile:
        type: container
      avatar:
        type: instance
        instanceOf: avatar
      welcome:
        type: container
      welcomeBack:
        type: text
      name:
        type: text
      buttons:
        type: container
      button:
        type: instance
        instanceOf: button
    props:
      welcomeText:
        type: string
        examples:
        - Welcome back!
      userName:
        type: string
        examples:
        - Syahrul Miftah
    default:
      layout:
      - root:
        - profile:
          - avatar
          - welcome:
            - welcomeBack
            - name
        - buttons:
          - button
          - button
      elements:
        root:
          styles:
            width: 343
            mainAxisAlignment: SPACE_BETWEEN
            primaryAxisSizingMode: FIXED
            layoutMode: HORIZONTAL
            layoutSizingVertical: HUG
            itemSpacing: 133
        profile:
          styles:
            mainAxisAlignment: CENTER
            layoutMode: VERTICAL
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            itemSpacing: 8
        avatar:
          styles:
            width: 40
            height: 40
          propConfigurations:
            size: sm
          instanceOf: avatar
        welcome:
          styles:
            layoutMode: VERTICAL
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
        welcomeBack:
          styles:
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            textColor: '#87878FFF'
            typography:
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 24
              letterSpacing: -0.25
            textAlignHorizontal: JUSTIFY
          content:
            $binding: '#/props/welcomeText'
        name:
          styles:
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            textColor: '#E3E4E9FF'
            typography:
              fontSize: 24
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 28
              letterSpacing: -0.25
            textAlignHorizontal: JUSTIFY
          content:
            $binding: '#/props/userName'
        buttons:
          styles:
            crossAxisAlignment: CENTER
            layoutMode: HORIZONTAL
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            itemSpacing: 8
        button:
          styles:
            width: 40
            height: 40
          propConfigurations:
            leftIcon: chevronLeft
            rightIcon: plus
            label: Day
            showRightIcon: true
            showLeftIcon: false
            type: Primary
            state: Default
            size: sm
          instanceOf: button
  pageHeader:
    title: Page Header
    anatomy:
      root:
        type: container
      button:
        type: instance
        instanceOf: button
      header:
        type: container
      smTitle:
        type: text
      mdTitle:
        type: text
      lgTitle:
        type: text
    props:
      smTitle:
        type: string
        examples:
        - Run at
        nullable: true
      mdTitle:
        type: string
        examples:
        - 31 Oct 2026, 15:24
        nullable: true
      lgTitle:
        type: string
        examples:
        - Add New Run
        nullable: true
        default: null
    default:
      layout:
      - root:
        - button
        - header:
          - smTitle
          - mdTitle
          - lgTitle
      elements:
        root:
          styles:
            width: 343
            primaryAxisSizingMode: FIXED
            crossAxisAlignment: CENTER
            layoutMode: HORIZONTAL
            layoutSizingVertical: HUG
            itemSpacing: 16
        button:
          styles:
            layoutSizingHorizontal: HUG
            height: 40
          propConfigurations:
            leftIcon: chevronLeft
            rightIcon: arrowLeft
            label: Day
            showRightIcon: true
            showLeftIcon: false
            type: Secondary
            state: Default
            size: sm
          instanceOf: button
        header:
          styles:
            layoutMode: VERTICAL
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            itemSpacing: 4
        smTitle:
          styles:
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            textColor: '#87878FFF'
            typography:
              fontSize: 12
              fontFamily: Roboto
              fontStyle: Regular
              letterSpacing: -0.24
          content:
            $binding: '#/props/smTitle'
        mdTitle:
          styles:
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            textColor: '#E3E4E9FF'
            typography:
              fontSize: 14
              fontFamily: Roboto
              fontStyle: Bold
              letterSpacing: -0.28
          content:
            $binding: '#/props/mdTitle'
        lgTitle:
          styles:
            visible: false
            width: 287
            height: 24
            textColor: '#E3E4E9FF'
            typography:
              fontSize: 18
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 24
              letterSpacing: -0.25
          content:
            $binding: '#/props/lgTitle'
  tabOutline:
    title: Tab Outline
    anatomy:
      root:
        type: container
      text:
        type: text
    props:
      state:
        type: string
        default: true
        enum:
        - true
        - false
      label:
        type: string
        examples:
        - Score
    default:
      layout:
      - root:
        - text
      elements:
        root:
          styles:
            cornerRadius: 100
            mainAxisAlignment: CENTER
            crossAxisAlignment: CENTER
            layoutMode: HORIZONTAL
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            strokes: '#4963F4FF'
            strokeWeight: 1
            itemSpacing: 10
            padding:
              top: 5
              bottom: 5
              start: 12
              end: 12
        text:
          styles:
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            textColor: '#4963F4FF'
            typography:
              fontSize: 12
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 16
              letterSpacing: -0.25
          content:
            $binding: '#/props/label'
    variants:
    - configuration:
        state: false
      elements:
        root:
          styles:
            strokes: '#303037FF'
        text:
          styles:
            textColor: '#E3E4E9FF'
  checkbox:
    title: Checkbox
    anatomy:
      root:
        type: container
      check:
        type: instance
        instanceOf: check
    props:
      checked:
        type: string
        default: true
        enum:
        - true
        - false
    default:
      layout:
      - root:
        - check
      elements:
        root:
          styles:
            cornerRadius: 4
            width: 20
            height: 20
            mainAxisAlignment: CENTER
            primaryAxisSizingMode: FIXED
            crossAxisAlignment: CENTER
            layoutMode: HORIZONTAL
            itemSpacing: 10
            padding: 8
            backgroundColor: '#E3E4E9FF'
            aspectRatio:
              x: 34
              y: 34
        check:
          styles:
            width: 16
            height: 16
          instanceOf: check
    variants:
    - configuration:
        checked: false
      elements:
        root:
          styles:
            strokes: '#303037FF'
            strokeAlign: INSIDE
            strokeWeight: 1
            backgroundColor: '#0E0D1203'
        check:
          styles:
            visible: false
  dotPoint:
    title: Dot Point
    anatomy:
      root:
        type: container
      dot:
        type: ellipse
    props:
      state:
        type: string
        default: false
        enum:
        - false
        - true
    default:
      layout:
      - root:
        - dot
      elements:
        root:
          styles:
            crossAxisAlignment: CENTER
            layoutMode: HORIZONTAL
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            itemSpacing: 10
        dot:
          styles:
            width: 7
            height: 7
            strokes: '#4963F4FF'
            strokeWeight: 1.5
            aspectRatio:
              x: 9
              y: 9
            fillColor: '#19191FFF'
    variants:
    - configuration:
        state: true
      elements:
        dot:
          styles:
            strokes: '#4963F466'
            strokeAlign: OUTSIDE
            strokeWeight: 4
            fillColor: '#4963F4FF'
  scoreBadge:
    title: Score Badge
    anatomy:
      '128':
        type: text
      root:
        type: container
      fill:
        type: rectangle
    props:
      value:
        type: string
        examples:
        - '128'
    default:
      layout:
      - root:
        - fill
        - '128'
      elements:
        '128':
          styles:
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            textColor: '#E3E4E9FF'
            typography:
              fontSize: 14
              fontFamily: Anton
              fontStyle: Regular
              lineHeight: 20
              letterSpacing: 0.7
            textAlignHorizontal: END
          content:
            $binding: '#/props/value'
        root:
          styles:
            clipsContent: true
            cornerRadius: 4
            mainAxisAlignment: CENTER
            crossAxisAlignment: CENTER
            layoutMode: HORIZONTAL
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            itemSpacing: 10
            padding: 8
        fill:
          styles:
            width: 36
            height: 36
            position: ABSOLUTE
            centerHorizontalOffset: 0
            centerVerticalOffset: 0
            backgroundColor:
              type: LINEAR
              angle: 0
              stops:
              - position: 0
                color: '#434350FF'
              - position: 1
                color: '#2E2E3CFF'
  chart:
    title: Chart
    anatomy:
      root:
        type: container
      tabs:
        type: container
      tabOutline:
        type: instance
        instanceOf: tabOutline
      data:
        type: container
      text:
        type: text
      dataGrid:
        type: container
      metric:
        type: instance
        instanceOf: metric
      lineChart:
        type: instance
        instanceOf: lineChart
    props:
      tab:
        type: string
        default: Score
        enum:
        - Volume
        - Score
      empty:
        type: string
        default: false
        enum:
        - false
        - true
    default:
      layout:
      - root:
        - tabs:
          - tabOutline
          - tabOutline
        - data:
          - text
          - dataGrid:
            - metric
            - metric
            - metric
        - lineChart
      elements:
        root:
          styles:
            cornerRadius: 12
            width: 343
            layoutMode: VERTICAL
            layoutSizingVertical: HUG
            itemSpacing: 16
        tabs:
          styles:
            primaryAxisSizingMode: FIXED
            layoutMode: HORIZONTAL
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            itemSpacing: 8
        tabOutline:
          styles:
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
          propConfigurations:
            label: Volume
            state: false
          instanceOf: tabOutline
        data:
          styles:
            layoutMode: VERTICAL
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            itemSpacing: 12
        text:
          styles:
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            textColor: '#E3E4E9FF'
            typography:
              fontSize: 14
              fontFamily: Roboto
              fontStyle: Bold
              lineHeight: 20
              letterSpacing: -0.25
          content: 19 Oct - 25 Oct, 2026
        dataGrid:
          styles:
            primaryAxisSizingMode: FIXED
            layoutMode: HORIZONTAL
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            itemSpacing: 24
        metric:
          styles:
            layoutSizingHorizontal: HUG
            layoutSizingVertical: FILL
          propConfigurations:
            label: Avg. Heart Rate
            showUnit: true
            unit: bpm
            metric: '163'
            size: sm
          instanceOf: metric
        lineChart:
          styles:
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
          propConfigurations:
            empty: false
          instanceOf: lineChart
    variants:
    - configuration:
        empty: true
      elements:
        metric:
          propConfigurations:
            metric: '0'
        lineChart:
          propConfigurations:
            empty: true
    - configuration:
        tab: Volume
      elements:
        tabOutline:
          propConfigurations:
            state: true
        metric:
          propConfigurations:
            label: Duration
            showUnit: false
            unit: km
            metric: 01:21:51
    - configuration:
        tab: Volume
        empty: true
      elements:
        metric:
          propConfigurations:
            metric: 00:00:00
  popup:
    title: Popup
    anatomy:
      root:
        type: container
      container:
        type: container
      triangleAlert:
        type: instance
        instanceOf: triangleAlert
      title:
        type: container
      name:
        type: text
      buttons:
        type: container
      button:
        type: instance
        instanceOf: button
      closeIcon:
        type: instance
        instanceOf: closeIcon
    props:
      destructive:
        type: string
        default: true
        enum:
        - false
        - true
      icon:
        type: string
        examples:
        - triangleAlert
      showSecondaryButton:
        type: boolean
        default: true
      showPrimaryButton:
        type: boolean
        default: true
      title:
        type: string
        examples:
        - Delete Activity
      description:
        type: string
        examples:
        - This activity will be deleted from the app
    default:
      layout:
      - root:
        - container:
          - triangleAlert
          - title:
            - name
            - name
        - buttons:
          - button
          - button
        - closeIcon
      elements:
        root:
          styles:
            cornerRadius: 12
            width: 300
            crossAxisAlignment: CENTER
            layoutMode: VERTICAL
            layoutSizingVertical: HUG
            strokes: '#303037FF'
            strokeWeight: 1
            itemSpacing: 24
            padding:
              top: 60
              bottom: 40
              start: 24
              end: 24
            backgroundColor: '#19191FFF'
        container:
          styles:
            crossAxisAlignment: CENTER
            layoutMode: VERTICAL
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            itemSpacing: 17
        triangleAlert:
          styles:
            width: 24
            height: 24
          instanceOf: triangleAlert
        title:
          styles:
            mainAxisAlignment: CENTER
            crossAxisAlignment: CENTER
            layoutMode: VERTICAL
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            itemSpacing: 4
        name:
          styles:
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            textColor: '#87878FFF'
            typography:
              fontSize: 14
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 20
              letterSpacing: -0.25
            textAlignHorizontal: CENTER
          content:
            $binding: '#/props/description'
        buttons:
          styles:
            primaryAxisSizingMode: FIXED
            crossAxisAlignment: CENTER
            layoutMode: HORIZONTAL
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            itemSpacing: 8
        button:
          styles:
            layoutSizingHorizontal: FILL
            height: 40
          propConfigurations:
            rightIcon: chevronRight
            leftIcon: chevronLeft
            label: Delete
            showRightIcon: false
            showLeftIcon: false
            type: Destructive
            state: Default
            size: sm
          instanceOf: button
        closeIcon:
          styles:
            width: 24
            height: 24
            position: ABSOLUTE
            top: 20
            end: 20
          instanceOf: closeIcon
    variants:
    - configuration:
        destructive: false
      elements:
        button:
          propConfigurations:
            label: Select File
            type: Primary
  lineChart:
    title: Line Chart
    anatomy:
      root:
        type: container
      container:
        type: container
      chart:
        type: container
      separator:
        type: container
      vector3:
        type: vector
      vector5:
        type: vector
      vector7:
        type: vector
      vector4:
        type: vector
      vector6:
        type: vector
      vector8:
        type: vector
      pointsContainer:
        type: container
      point:
        type: container
      dotPoint:
        type: instance
        instanceOf: dotPoint
      yAxisLabel:
        type: container
      data2:
        type: text
      data4:
        type: text
      data3:
        type: text
      xAxisLabel:
        type: container
    props:
      empty:
        type: string
        default: false
        enum:
        - false
        - true
    default:
      layout:
      - root:
        - container:
          - chart:
            - separator:
              - vector3
              - vector5
              - vector7
              - vector4
              - vector6
            - vector8
            - chart:
              - pointsContainer:
                - point:
                  - dotPoint
                - point:
                  - dotPoint
                - point:
                  - dotPoint
                - point:
                  - dotPoint
                - point:
                  - dotPoint
                - point:
                  - dotPoint
                - point:
                  - dotPoint
                - point:
                  - dotPoint
                - point:
                  - dotPoint
                - point:
                  - dotPoint
                - point:
                  - dotPoint
                - point:
                  - dotPoint
          - yAxisLabel:
            - data2
            - data4
            - data3
        - xAxisLabel:
          - data2
          - data4
          - data3
      elements:
        root:
          styles:
            width: 343
            layoutMode: VERTICAL
            layoutSizingVertical: HUG
            itemSpacing: 8
        container:
          styles:
            primaryAxisSizingMode: FIXED
            layoutMode: HORIZONTAL
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            itemSpacing: 8
        chart:
          styles:
            crossAxisAlignment: CENTER
            layoutMode: VERTICAL
            itemReverseZIndex: true
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            itemSpacing: -90
        separator:
          styles:
            height: 162
            mainAxisAlignment: SPACE_BETWEEN
            primaryAxisSizingMode: FIXED
            layoutMode: VERTICAL
            layoutSizingHorizontal: FILL
            itemSpacing: 8
        vector3:
          styles:
            layoutSizingHorizontal: FILL
            strokes: '#303037FF'
            strokeAlign: CENTER
            strokeWeight: 1
        vector5:
          styles:
            layoutSizingHorizontal: FILL
            strokes: '#303037FF'
            strokeAlign: CENTER
            strokeWeight: 1
        vector7:
          styles:
            layoutSizingHorizontal: FILL
            strokes: '#303037FF'
            strokeAlign: CENTER
            strokeWeight: 1
        vector4:
          styles:
            layoutSizingHorizontal: FILL
            strokes: '#303037FF'
            strokeAlign: CENTER
            strokeWeight: 1
        vector6:
          styles:
            layoutSizingHorizontal: FILL
            strokes: '#303037FF'
            strokeAlign: CENTER
            strokeWeight: 1
        vector8:
          styles:
            height: 162
            position: ABSOLUTE
            centerHorizontalOffset: 14.5
            centerVerticalOffset: 0
            strokes: '#E3E4E9FF'
            strokeAlign: CENTER
            strokeWeight: 1.5
        pointsContainer:
          styles:
            height: 162
            mainAxisAlignment: SPACE_BETWEEN
            primaryAxisSizingMode: FIXED
            crossAxisAlignment: CENTER
            layoutMode: HORIZONTAL
            layoutSizingHorizontal: FILL
            itemSpacing: 35
        point:
          styles:
            crossAxisAlignment: END
            layoutMode: HORIZONTAL
            layoutSizingHorizontal: HUG
            layoutSizingVertical: FILL
            itemSpacing: 10
            padding:
              top: 0
              bottom: 84
              start: 0
              end: 0
        dotPoint:
          styles:
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
          propConfigurations:
            state: false
          instanceOf: dotPoint
        yAxisLabel:
          styles:
            width: 16
            mainAxisAlignment: SPACE_BETWEEN
            primaryAxisSizingMode: FIXED
            layoutMode: VERTICAL
            layoutSizingVertical: FILL
            itemSpacing: 4
        data2:
          styles:
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            textColor: '#87878FFF'
            typography:
              fontSize: 10
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 14
              letterSpacing: -0.25
            textAlignHorizontal: CENTER
          content: SEP
        data4:
          styles:
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            textColor: '#87878FFF'
            typography:
              fontSize: 10
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 14
              letterSpacing: -0.25
            textAlignHorizontal: CENTER
          content: OCT
        data3:
          styles:
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            textColor: '#87878FFF'
            typography:
              fontSize: 10
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 14
              letterSpacing: -0.25
            textAlignHorizontal: CENTER
          content: NOV
        xAxisLabel:
          styles:
            primaryAxisSizingMode: FIXED
            crossAxisAlignment: CENTER
            layoutMode: HORIZONTAL
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            itemSpacing: 4
            padding:
              top: 0
              bottom: 0
              start: 0
              end: 32
    variants:
    - configuration:
        empty: true
      elements:
        chart:
          styles:
            itemSpacing: -30
        point:
          styles:
            padding: 0
  inlineMessage:
    title: Inline Message
    anatomy:
      root:
        type: container
      triangleAlert:
        type: instance
        instanceOf: triangleAlert
      container:
        type: container
      title:
        type: text
      description:
        type: text
    props:
      type:
        type: string
        default: Error
        enum:
        - Error
        - Warning
        - Success
        - Info
      title:
        type: string
        examples:
        - Title
      description:
        type: string
        examples:
        - Description
        nullable: true
      icon:
        type: string
        examples:
        - triangleAlert
    default:
      layout:
      - root:
        - triangleAlert
        - container:
          - title
          - description
      elements:
        root:
          styles:
            cornerRadius: 12
            width: 343
            primaryAxisSizingMode: FIXED
            layoutMode: HORIZONTAL
            layoutSizingVertical: HUG
            itemSpacing: 8
            padding: 12
            backgroundColor: '#BA49493D'
        triangleAlert:
          styles:
            width: 20
            height: 20
          instanceOf: triangleAlert
        container:
          styles:
            mainAxisAlignment: CENTER
            layoutMode: VERTICAL
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            itemSpacing: 2
        title:
          styles:
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            textColor: '#BA4949FF'
            typography:
              fontSize: 12
              fontFamily: Roboto
              fontStyle: Bold
              lineHeight: 16
              letterSpacing: -0.25
          content:
            $binding: '#/props/title'
        description:
          styles:
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            textColor: '#BA4949FF'
            typography:
              fontSize: 12
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 16
              letterSpacing: -0.25
          content:
            $binding: '#/props/description'
    variants:
    - configuration:
        type: Warning
      layout:
      - root:
        - triangleAlert
        - container:
          - description
          - description
      elements:
        root:
          styles:
            backgroundColor: '#D7960A3D'
        description:
          styles:
            textColor: '#D7960AFF'
    - configuration:
        type: Success
      elements:
        root:
          styles:
            backgroundColor: '#4AC1893D'
        title:
          styles:
            textColor: '#4AC189FF'
        description:
          styles:
            textColor: '#4AC189FF'
    - configuration:
        type: Info
      elements:
        root:
          styles:
            backgroundColor: '#4963F43D'
        title:
          styles:
            textColor: '#4963F4FF'
        description:
          styles:
            textColor: '#4963F4FF'
  toast:
    title: Toast
    anatomy:
      root:
        type: container
      badgeCheck:
        type: instance
        instanceOf: badgeCheck
      title:
        type: container
      name:
        type: text
      button:
        type: instance
        instanceOf: button
    props:
      type:
        type: string
        default: Success
        enum:
        - Success
        - Error
      icon:
        type: string
        examples:
        - badgeCheck
      title:
        type: string
        examples:
        - Failed to load data
      description:
        type: string
        examples:
        - Now you can view the stats of the activity
        nullable: true
    default:
      layout:
      - root:
        - badgeCheck
        - title:
          - name
          - name
        - button
      elements:
        root:
          styles:
            cornerRadius: 12
            width: 343
            primaryAxisSizingMode: FIXED
            layoutMode: HORIZONTAL
            layoutSizingVertical: HUG
            strokes: '#303037FF'
            strokeWeight: 1
            itemSpacing: 12
            padding: 24
            backgroundColor: '#19191FFF'
        badgeCheck:
          styles:
            width: 24
            height: 24
          instanceOf: badgeCheck
        title:
          styles:
            mainAxisAlignment: CENTER
            crossAxisAlignment: CENTER
            layoutMode: VERTICAL
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            itemSpacing: 4
        name:
          styles:
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            textColor: '#87878FFF'
            typography:
              fontSize: 14
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 20
              letterSpacing: -0.25
          content:
            $binding: '#/props/description'
        button:
          styles:
            layoutSizingHorizontal: HUG
            height: 40
          propConfigurations:
            rightIcon: chevronRight
            leftIcon: arrowLeftRight
            label: Dismiss
            showRightIcon: false
            showLeftIcon: false
            type: Secondary
            state: Default
            size: sm
          instanceOf: button
  table:
    title: Table
    anatomy:
      '163':
        type: text
      root:
        type: container
      checkbox:
        type: instance
        instanceOf: checkbox
      data:
        type: container
      dateAndRunCount:
        type: container
      date:
        type: text
      dot:
        type: text
      runCount:
        type: text
      runData:
        type: container
      distance:
        type: text
      time:
        type: text
      pace:
        type: text
      heartRate:
        type: container
      heartPulse:
        type: instance
        instanceOf: heartPulse
      scoreContainer:
        type: container
      scoreBadge:
        type: instance
        instanceOf: scoreBadge
      ? ''
      : type: text
        detectedIn: Checked=No, No HR Flag=Yes
    props:
      checked:
        type: string
        default: false
        enum:
        - false
        - true
      noHrFlag:
        type: string
        default: false
        enum:
        - false
        - true
      date:
        type: string
        examples:
        - 31 Oct
      numberOfRuns:
        type: string
        examples:
        - 5 runs
        nullable: true
      distance:
        type: string
        examples:
        - 10.20 km
      duration:
        type: string
        examples:
        - 01:21:51
      pace:
        type: string
        examples:
        - 8’15”
      heartRate:
        type: string
        examples:
        - '163'
    default:
      layout:
      - root:
        - checkbox
        - data:
          - dateAndRunCount:
            - date
            - dot
            - runCount
          - runData:
            - distance
            - time
            - pace
            - heartRate:
              - heartPulse
              - '163'
        - scoreContainer:
          - scoreBadge
      elements:
        '163':
          styles:
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            textColor: '#E3E4E9FF'
            typography:
              fontSize: 14
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 20
              letterSpacing: -0.25
          content:
            $binding: '#/props/heartRate'
        root:
          styles:
            cornerRadius: 8
            width: 343
            primaryAxisSizingMode: FIXED
            crossAxisAlignment: CENTER
            layoutMode: HORIZONTAL
            layoutSizingVertical: HUG
            itemSpacing: 12
            padding:
              top: 8
              bottom: 8
              start: 16
              end: 16
            backgroundColor: '#19191FFF'
        checkbox:
          styles:
            width: 20
            height: 20
          propConfigurations:
            checked: false
          instanceOf: checkbox
        data:
          styles:
            mainAxisAlignment: CENTER
            layoutMode: VERTICAL
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            itemSpacing: 8
        dateAndRunCount:
          styles:
            primaryAxisSizingMode: FIXED
            layoutMode: HORIZONTAL
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            itemSpacing: 4
        date:
          styles:
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            textColor: '#87878FFF'
            typography:
              fontSize: 12
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 16
              letterSpacing: -0.25
          content:
            $binding: '#/props/date'
        dot:
          styles:
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            textColor: '#87878FFF'
            typography:
              fontSize: 12
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 16
              letterSpacing: -0.25
          content: ·
        runCount:
          styles:
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            textColor: '#87878FFF'
            typography:
              fontSize: 12
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 16
              letterSpacing: -0.25
          content:
            $binding: '#/props/numberOfRuns'
        runData:
          styles:
            mainAxisAlignment: SPACE_BETWEEN
            primaryAxisSizingMode: FIXED
            crossAxisAlignment: CENTER
            layoutMode: HORIZONTAL
            layoutSizingHorizontal: FILL
            layoutSizingVertical: HUG
            itemSpacing: 8
        distance:
          styles:
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            textColor: '#E3E4E9FF'
            typography:
              fontSize: 14
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 20
              letterSpacing: -0.25
            textAlignHorizontal: END
          content:
            $binding: '#/props/distance'
        time:
          styles:
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            textColor: '#E3E4E9FF'
            typography:
              fontSize: 14
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 20
              letterSpacing: -0.25
            textAlignHorizontal: END
          content:
            $binding: '#/props/duration'
        pace:
          styles:
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            textColor: '#E3E4E9FF'
            typography:
              fontSize: 14
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 20
              letterSpacing: -0.25
            textAlignHorizontal: END
          content:
            $binding: '#/props/pace'
        heartRate:
          styles:
            mainAxisAlignment: END
            crossAxisAlignment: CENTER
            layoutMode: HORIZONTAL
            layoutSizingHorizontal: HUG
            layoutSizingVertical: FILL
            itemSpacing: 4
        heartPulse:
          styles:
            width: 12
            height: 12
          instanceOf: heartPulse
        scoreContainer:
          styles:
            width: 50
            mainAxisAlignment: END
            primaryAxisSizingMode: FIXED
            crossAxisAlignment: CENTER
            layoutMode: HORIZONTAL
            layoutSizingVertical: HUG
            itemSpacing: 10
        scoreBadge:
          styles:
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
          propConfigurations:
            value: '128'
          instanceOf: scoreBadge
        ? ''
        : styles:
            layoutSizingHorizontal: HUG
            layoutSizingVertical: HUG
            textColor: '#BA4949FF'
            typography:
              fontSize: 14
              fontFamily: Roboto
              fontStyle: Regular
              lineHeight: 20
              letterSpacing: -0.25
          content: '-'
    variants:
    - configuration:
        noHrFlag: true
      layout:
      - root:
        - checkbox
        - data:
          - dateAndRunCount:
            - date
            - dot
            - runCount
          - runData:
            - distance
            - time
            - pace
            - heartRate:
              - heartPulse
              - ''
        - scoreContainer:
          - scoreBadge
    - configuration:
        checked: true
      elements:
        root:
          styles:
            backgroundColor: '#27272FFF'
        checkbox:
          propConfigurations:
            checked: true
